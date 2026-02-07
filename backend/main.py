from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import List, Optional, Dict, Any

from backend.utils.data_loader import load_data, get_data_dictionary
from backend.utils.stat_utils import fit_distribution, ks_test_normality, calculate_entropy, perform_pca, regression_analysis, cramers_v, perform_ttest, calculate_gini

app = FastAPI(title="Social Media Addiction API", version="1.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Data Once
df = load_data()

# --- Models ---
class RegressionRequest(BaseModel):
    target: str
    predictors: List[str]
    model_type: str = "OLS"

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Social Media Addiction Analysis API is running."}

@app.get("/api/summary")
def get_summary():
    if df.empty:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    numeric_df = df.select_dtypes(include=[np.number])
    summary = {
        "total_students": int(df.shape[0]),
        "avg_usage": float(df['Avg_Daily_Usage_Hours'].mean()),
        "avg_addiction": float(df['Addicted_Score'].mean()),
        "avg_mental_health": float(df['Mental_Health_Score'].mean()),
        "columns": df.columns.tolist()
    }
    return summary

@app.get("/api/raw_data")
def get_raw_data(limit: int = 100):
    if df.empty:
        return []
    return df.head(limit).fillna("").to_dict(orient="records")

@app.get("/api/eda/dist/{col}")
def get_distribution(col: str, dist_type: str = "norm"):
    if col not in df.columns:
        raise HTTPException(status_code=404, detail="Column not found")
    
    data = df[col].dropna()
    
    # Histogram Data
    hist_values, bin_edges = np.histogram(data, bins=30, density=True)
    
    # Fitted Curve
    x_vals, pdf_vals, params = fit_distribution(data, dist_type)
    
    return {
        "histogram": {
            "x": ((bin_edges[:-1] + bin_edges[1:]) / 2).tolist(),
            "y": hist_values.tolist()
        },
        "fitted": {
            "x": x_vals.tolist() if x_vals is not None else [],
            "y": pdf_vals.tolist() if pdf_vals is not None else [],
            "params": params
        },
        "stats": {
            "skewness": float(data.skew()),
            "kurtosis": float(data.kurtosis()),
            "mean": float(data.mean()),
            "std": float(data.std())
        }
    }

@app.post("/api/bivariate/correlation")
def get_correlation_matrix():
    numeric_df = df.select_dtypes(include=[np.number])
    # Exclude ID
    if 'Student_ID' in numeric_df.columns:
        numeric_df = numeric_df.drop(columns=['Student_ID'])
        
    corr_matrix = numeric_df.corr().fillna(0)
    
    return {
        "x": corr_matrix.columns.tolist(),
        "y": corr_matrix.columns.tolist(),
        "z": corr_matrix.values.tolist()
    }

@app.post("/api/models/regression")
def run_regression(req: RegressionRequest):
    try:
        model = regression_analysis(df, req.target, req.predictors, req.model_type)
        if model is None:
            raise HTTPException(status_code=400, detail="Model training failed")
            
        summary_html = model.summary().as_html()
        
        # Extract key metrics
        diagnostics = {
            "r_squared": model.rsquared if hasattr(model, 'rsquared') else model.prsquared,
            "aic": model.aic,
            "params": model.params.to_dict(),
            "pvalues": model.pvalues.to_dict()
        }
        
        return {
            "summary_html": summary_html,
            "diagnostics": diagnostics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class PcaRequest(BaseModel):
    cols: List[str]

@app.post("/api/multivariate/pca")
def get_pca(req: PcaRequest):
    try:
        pca, scaled_data, components = perform_pca(df, req.cols)
        
        return {
            "explained_variance": pca.explained_variance_ratio_.tolist(),
            "cumulative_variance": np.cumsum(pca.explained_variance_ratio_).tolist(),
            "components": pca.components_.tolist(),
            "feature_names": req.cols
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BoxPlotRequest(BaseModel):
    x_col: str
    y_col: str

@app.post("/api/bivariate/boxplot")
def get_boxplot_stats(req: BoxPlotRequest):
    if req.x_col not in df.columns or req.y_col not in df.columns:
        raise HTTPException(status_code=404, detail="Column not found")
        
    data = df[[req.x_col, req.y_col]].dropna()
    
    results = []
    groups = data.groupby(req.x_col)[req.y_col]
    
    for name, group in groups:
        # Calculate quartiles using numpy
        q1 = np.percentile(group, 25)
        median = np.percentile(group, 50)
        q3 = np.percentile(group, 75)
        iqr = q3 - q1
        
        # Calculate whiskers (1.5 * IQR rule)
        lower_whisker = max(group.min(), q1 - 1.5 * iqr)
        upper_whisker = min(group.max(), q3 + 1.5 * iqr)
        
        # Identify outliers
        outliers = group[(group < lower_whisker) | (group > upper_whisker)].tolist()
        
        # Count for sizing/info
        count = len(group)
        
        results.append({
            "category": str(name),
            "min": float(lower_whisker),
            "q1": float(q1),
            "median": float(median),
            "q3": float(q3),
            "max": float(upper_whisker),
            "outliers": [float(x) for x in outliers],
            "count": int(count)
        })
        
    return results

class BoxPlotRequest(BaseModel):
    x_col: str
    y_col: str

@app.post("/api/bivariate/boxplot")
def get_boxplot_stats(req: BoxPlotRequest):
    if req.x_col not in df.columns or req.y_col not in df.columns:
        raise HTTPException(status_code=404, detail="Column not found")
        
    data = df[[req.x_col, req.y_col]].dropna()
    
    results = []
    groups = data.groupby(req.x_col)[req.y_col]
    
    for name, group in groups:
        # Calculate quartiles using numpy
        q1 = np.percentile(group, 25)
        median = np.percentile(group, 50)
        q3 = np.percentile(group, 75)
        iqr = q3 - q1
        
        # Calculate whiskers (1.5 * IQR rule)
        lower_whisker = max(group.min(), q1 - 1.5 * iqr)
        upper_whisker = min(group.max(), q3 + 1.5 * iqr)
        
        # Identify outliers
        outliers = group[(group < lower_whisker) | (group > upper_whisker)].tolist()
        
        # Count for sizing/info
        count = len(group)
        
        results.append({
            "category": str(name),
            "min": float(lower_whisker),
            "q1": float(q1),
            "median": float(median),
            "q3": float(q3),
            "max": float(upper_whisker),
            "outliers": [float(x) for x in outliers],
            "count": int(count)
        })
        
    return results

@app.get("/api/metrics/monte_carlo")
def run_monte_carlo(n_sim: int = 1000):
    data_col = df['Addicted_Score'].dropna().values
    sample_means = []
    
    for _ in range(n_sim):
        resample = np.random.choice(data_col, size=len(data_col), replace=True)
        sample_means.append(np.mean(resample))
        
    lower_ci = np.percentile(sample_means, 2.5)
    upper_ci = np.percentile(sample_means, 97.5)
    
    hist, bins = np.histogram(sample_means, bins=30)
    
    return {
        "ci_95": [lower_ci, upper_ci],
        "dist": {
            "x": ((bins[:-1] + bins[1:]) / 2).tolist(),
            "y": hist.tolist()
        }
    }
class TTestRequest(BaseModel):
    group_col: str
    value_col: str

@app.post("/api/inference/ttest")
def run_ttest(req: TTestRequest):
    result = perform_ttest(df, req.group_col, req.value_col)
    if result is None:
        raise HTTPException(status_code=400, detail="Group column must have exactly 2 unique values")
    return result

@app.get("/api/metrics/inequality")
def get_inequality_metrics():
    # Calculate Gini for relevant continuous variables
    metrics = {}
    for col in ['Avg_Daily_Usage_Hours', 'Addicted_Score', 'Mental_Health_Score']:
        if col in df.columns:
            data = df[col].dropna().values
            metrics[col] = calculate_gini(data)
    return metrics


import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import statsmodels.api as sm
from utils.data_loader import load_data
from utils.stat_utils import regression_analysis

st.set_page_config(page_title="Statistical Modeling", page_icon="🔮", layout="wide")

st.title("5️⃣ Statistical Modeling: Regression & GLMs")

df = load_data()
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# --- Section 1: OLS Regression ---
st.header("1. Linear Regression (OLS)")
st.markdown("Model a continuous target variable.")

col_target = st.selectbox("Target Variable (Y):", ['Mental_Health_Score', 'Addicted_Score'], index=0)
col_features = st.multiselect("Predictor Variables (X):", ['Avg_Daily_Usage_Hours', 'Age', 'Sleep_Hours_Per_Night', 'Conflicts_Over_Social_Media'], default=['Avg_Daily_Usage_Hours', 'Sleep_Hours_Per_Night'])

if len(col_features) > 0:
    model_ols = regression_analysis(df, col_target, col_features, model_type='OLS')
    
    st.write("### Model Summary")
    st.text(model_ols.summary().as_text())
    
    st.info("Check **P>|t|** to see if a coefficient is significantly different from 0.")

# --- Section 2: Logistic Regression ---
st.divider()
st.header("2. Logistic Regression (Binary Classification)")
st.markdown("Model the probability of a binary outcome (e.g., Affects Academic Performance).")

df['Binary_Impact'] = df['Affects_Academic_Performance'].apply(lambda x: 1 if x == 'Yes' else 0)

col_feats_log = st.multiselect("Predictors for Academic Impact:", ['Avg_Daily_Usage_Hours', 'Addicted_Score', 'Sleep_Hours_Per_Night'], default=['Addicted_Score'])

if len(col_feats_log) > 0:
    model_logit = regression_analysis(df, 'Binary_Impact', col_feats_log, model_type='Logit')
    
    st.write("### Logit Model Summary")
    st.text(model_logit.summary().as_text())
    
    # Visualizing the Sigmoid
    if len(col_feats_log) == 1:
        x_name = col_feats_log[0]
        st.subheader(f"Probability Curve: Impact vs {x_name}")
        
        # Plot
        x_range = np.linspace(df[x_name].min(), df[x_name].max(), 100)
        exog = sm.add_constant(pd.DataFrame({x_name: x_range}))
        
        # Verify feature name match for prediction
        # Statsmodels is tricky with names in add_constant. 
        # Manual prediction for visualization: 1/(1+e^-(b0 + b1x))
        params = model_logit.params
        b0 = params['const']
        b1 = params[x_name]
        y_prob = 1 / (1 + np.exp(-(b0 + b1 * x_range)))
        
        fig_log = px.scatter(df, x=x_name, y='Binary_Impact', title="Logistic Regression Fit", opacity=0.3)
        fig_log.add_scatter(x=x_range, y=y_prob, mode='lines', name='Probability')
        st.plotly_chart(fig_log, use_container_width=True)

# --- Section 3: Quantile Regression Visual ---
st.divider()
st.header("3. Quantile Regression Visualization")
st.markdown("Does the relationship change for extreme users (90th percentile)?")

q_target = 'Addicted_Score'
q_feat = 'Avg_Daily_Usage_Hours'

fig_quant = px.scatter(df, x=q_feat, y=q_target, trendline="ols", title=f"OLS Trend for {q_target}")
st.plotly_chart(fig_quant, use_container_width=True)
st.caption("Standard OLS shows the mean effect. Quantile regression would show slopes for the top 10% separate from the median.")

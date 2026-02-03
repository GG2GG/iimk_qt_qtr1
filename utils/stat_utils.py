
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import statsmodels.api as sm

def calculate_entropy(series):
    """Calculates the Shannon Entropy of a categorical series."""
    probs = series.value_counts(normalize=True)
    entropy = -np.sum(probs * np.log2(probs))
    return entropy

def fit_distribution(data, dist_name='norm'):
    """
    Fits a specified distribution to the data and returns parameters & PDF.
    Supported: 'norm', 'lognorm', 'gamma'.
    """
    data = data.dropna()
    x = np.linspace(data.min(), data.max(), 100)
    
    if dist_name == 'norm':
        mu, std = stats.norm.fit(data)
        pdf = stats.norm.pdf(x, mu, std)
        params = {'mu': mu, 'std': std}
        
    elif dist_name == 'lognorm':
        # shape, loc, scale
        s, loc, scale = stats.lognorm.fit(data)
        pdf = stats.lognorm.pdf(x, s, loc, scale)
        params = {'shape': s, 'loc': loc, 'scale': scale}
        
    elif dist_name == 'gamma':
        a, loc, scale = stats.gamma.fit(data)
        pdf = stats.gamma.pdf(x, a, loc, scale)
        params = {'alpha': a, 'loc': loc, 'scale': scale}
        
    else:
        return None, None, {}

    return x, pdf, params

def perform_pca(df, numeric_cols):
    """
    Performs PCA on specified numeric columns.
    Returns pca object, standardized data, and transformed components.
    """
    data = df[numeric_cols].dropna()
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    
    pca = PCA()
    components = pca.fit_transform(scaled_data)
    
    return pca, scaled_data, components

def regression_analysis(df, target_col, predictor_cols, model_type='OLS'):
    """
    Runs OLS or Logit regression using statsmodels.
    """
    data = df[[target_col] + predictor_cols].dropna()
    Y = data[target_col]
    X = data[predictor_cols]
    X = sm.add_constant(X)
    
    if model_type == 'OLS':
        model = sm.OLS(Y, X).fit()
    elif model_type == 'Logit':
        model = sm.Logit(Y, X).fit(disp=0)
    else:
        return None
        
    return model

def ks_test_normality(data):
    """
    Performs Kolmogorov-Smirnov test for normality.
    Returns statistic and p-value.
    """
    data = data.dropna()
    # Standardize data to compare against standard normal
    standardized_data = (data - data.mean()) / data.std()
    return stats.kstest(standardized_data, 'norm')

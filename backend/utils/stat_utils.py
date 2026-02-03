
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

from scipy.stats import chi2_contingency

def cramers_v(x, y):
    """Calculates Cramers V statistic for categorical-categorical association."""
    confusion_matrix = pd.crosstab(x, y)
    chi2 = chi2_contingency(confusion_matrix)[0]
    n = confusion_matrix.sum().sum()
    phi2 = chi2 / n
    r, k = confusion_matrix.shape
    return np.sqrt(phi2 / min(k-1, r-1))

def perform_ttest(df, group_col, value_col):
    """
    Performs Independent T-Test between two groups.
    Returns t-statistic, p-value, and group means.
    """
    groups = df[group_col].dropna().unique()
    if len(groups) != 2:
        return None
    
    g1 = df[df[group_col] == groups[0]][value_col].dropna()
    g2 = df[df[group_col] == groups[1]][value_col].dropna()
    
    t_stat, p_val = stats.ttest_ind(g1, g2)
    
    return {
        "groups": [str(g) for g in groups],
        "means": [float(g1.mean()), float(g2.mean())],
        "t_statistic": float(t_stat),
        "p_value": float(p_val)
    }

def calculate_gini(array):
    """Calculate the Gini coefficient of a numpy array."""
    array = np.array(array).flatten()
    if np.amin(array) < 0:
        array -= np.amin(array)
    array = np.sort(array)
    index = np.arange(1, array.shape[0] + 1)
    n = array.shape[0]
    return ((np.sum((2 * index - n - 1) * array)) / (n * np.sum(array)))

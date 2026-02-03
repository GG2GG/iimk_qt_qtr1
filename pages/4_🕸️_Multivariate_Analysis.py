
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from utils.data_loader import load_data
from utils.stat_utils import perform_pca

st.set_page_config(page_title="Multivariate Analysis", page_icon="🕸️", layout="wide")

st.title("4️⃣ Multivariate Analysis: Linear Algebra & PCA")
st.markdown("Analyzing the joint behavior of multiple variables simultaneously using Matrix Algebra.")

df = load_data()
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
# Remove IDs or useless cols
numeric_cols = [c for c in numeric_cols if c not in ['Student_ID']]

# --- Section 1: Matrices ---
st.header("1. The Covariance & Correlation Matrices")
col1, col2 = st.columns(2)

with col1:
    st.subheader("Covariance Matrix ($\Sigma$)")
    cov_matrix = df[numeric_cols].cov()
    st.dataframe(cov_matrix.style.background_gradient(cmap='coolwarm', axis=None))
    st.caption("Diagonal = Variance, Off-diagonal = Covariance.")

with col2:
    st.subheader("Correlation Matrix ($R$)")
    corr_matrix = df[numeric_cols].corr()
    st.dataframe(corr_matrix.style.text_gradient(cmap='RdBu', vmin=-1, vmax=1))
    st.caption("Standardized covariance.")

# --- Section 2: PCA ---
st.divider()
st.header("2. Principal Component Analysis (PCA)")
st.markdown("""
**PCA** reduces dimensionality by finding the "Principal Components" (Eigenvectors) that maximize variance.
Useful for identifying **Latent Variables** (e.g., hidden "Addiction Factor").
""")

pca_cols = st.multiselect("Select variables for PCA:", numeric_cols, default=['Avg_Daily_Usage_Hours', 'Addicted_Score', 'Mental_Health_Score', 'Sleep_Hours_Per_Night'])

if len(pca_cols) < 2:
    st.error("Select at least 2 variables.")
else:
    pca, scaled_data, components = perform_pca(df, pca_cols)
    
    # Scree Plot
    explained_variance = pca.explained_variance_ratio_
    cumulative_variance = np.cumsum(explained_variance)
    
    col_pca1, col_pca2 = st.columns(2)
    
    with col_pca1:
        st.subheader("Scree Plot (Eigenvalues)")
        fig_scree = go.Figure()
        fig_scree.add_trace(go.Bar(x=list(range(1, len(explained_variance)+1)), y=explained_variance, name='Explained Variance'))
        fig_scree.add_trace(go.Scatter(x=list(range(1, len(explained_variance)+1)), y=cumulative_variance, name='Cumulative Variance'))
        fig_scree.update_layout(title="Explained Variance by Component")
        st.plotly_chart(fig_scree, use_container_width=True)
        
    with col_pca2:
        st.subheader("Component Loadings (Eigenvectors)")
        loadings = pd.DataFrame(pca.components_.T, columns=[f"PC{i+1}" for i in range(len(pca_cols))], index=pca_cols)
        st.dataframe(loadings.style.background_gradient(cmap='RdBu_r'))
        
    st.info(f"""
    **Interpretation:**
    - **PC1** explains **{explained_variance[0]:.1%}** of the total variance.
    - If PC1 loads heavily on *Usage* and *Addicted Score*, it represents the "Addiction Factor".
    """)

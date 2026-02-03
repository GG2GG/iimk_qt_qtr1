
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from scipy import stats
from utils.data_loader import load_data

st.set_page_config(page_title="Experimental Metrics", page_icon="🧮", layout="wide")

st.title("7️⃣ Experimental & Research Metrics")
st.markdown("Advanced custom indices, inequality measures, and simulations.")

df = load_data()

# --- Section 1: Index Construction ---
st.header("1. Latent Index Construction (Digital Addiction Index)")
st.markdown("Constructing a composite score using Z-Score Normalization.")

# Variables for index
index_vars = ['Avg_Daily_Usage_Hours', 'Addicted_Score', 'Conflicts_Over_Social_Media']
idx_df = df[index_vars].dropna()

# Calculate Z-Scores
for col in index_vars:
    idx_df[f'Z_{col}'] = stats.zscore(idx_df[col])

# Composite Index (Mean of Z-Scores)
idx_df['Digital_Index'] = idx_df[[f'Z_{c}' for c in index_vars]].mean(axis=1)

# Rescale to 0-100 for readability
min_val = idx_df['Digital_Index'].min()
max_val = idx_df['Digital_Index'].max()
idx_df['Digital_Index_Scaled'] = ((idx_df['Digital_Index'] - min_val) / (max_val - min_val)) * 100

st.dataframe(idx_df.head(10))

fig_hist = px.histogram(idx_df, x='Digital_Index_Scaled', nbins=30, title="Distribution of Constructed Digital Addiction Index", color_discrete_sequence=['teal'])
st.plotly_chart(fig_hist, use_container_width=True)


# --- Section 2: Inequality Analysis ---
st.divider()
st.header("2. Inequality Analysis (Gini Coefficient)")
st.markdown("Is usage concentrated among a small 'heavy user' group?")

def gini(x):
    total = 0
    for i, xi in enumerate(x[:-1], 1):
        total += np.sum(np.abs(xi - x[i:]))
    return total / (len(x)**2 * np.mean(x))

usage_sorted = np.sort(df['Avg_Daily_Usage_Hours'].dropna())
gini_val = gini(usage_sorted)

st.metric("Gini Coefficient (Usage)", f"{gini_val:.3f}", help="0 = Perfect Equality, 1 = Perfect Inequality")

# Lorenz Curve
lorenz_curve = np.cumsum(usage_sorted) / usage_sorted.sum()
lorenz_curve = np.insert(lorenz_curve, 0, 0)
x_axis = np.linspace(0, 1, len(lorenz_curve))

fig_lorenz = go.Figure()
fig_lorenz.add_trace(go.Scatter(x=x_axis, y=lorenz_curve, name='Lorenz Curve', fill='tozeroy'))
fig_lorenz.add_trace(go.Scatter(x=[0, 1], y=[0, 1], name='Perfect Equality', line=dict(dash='dash', color='gray')))
fig_lorenz.update_layout(title="Lorenz Curve of Usage Hours", xaxis_title="Cumulative Share of Students", yaxis_title="Cumulative Share of Usage")
st.plotly_chart(fig_lorenz, use_container_width=True)


# --- Section 3: Monte Carlo Simulation ---
st.divider()
st.header("3. Monte Carlo Simulation (Bootstrapping)")
st.markdown("Estimating the confidence interval of the Mean Addiction Score via resampling.")

n_simulations = st.slider("Number of Simulations:", 100, 5000, 1000)
sample_means = []

data_col = df['Addicted_Score'].dropna().values

for _ in range(n_simulations):
    resample = np.random.choice(data_col, size=len(data_col), replace=True)
    sample_means.append(np.mean(resample))

lower_ci = np.percentile(sample_means, 2.5)
upper_ci = np.percentile(sample_means, 97.5)

st.success(f"**95% Confidence Interval:** [{lower_ci:.2f}, {upper_ci:.2f}]")

fig_boot = px.histogram(x=sample_means, nbins=30, title="Bootstrap Distribution of Mean", labels={'x': 'Sample Mean'})
fig_boot.add_vline(x=lower_ci, line_dash="dash", line_color="red", annotation_text="2.5%")
fig_boot.add_vline(x=upper_ci, line_dash="dash", line_color="red", annotation_text="97.5%")
st.plotly_chart(fig_boot, use_container_width=True)

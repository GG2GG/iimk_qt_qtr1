
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
from scipy.stats import skew, kurtosis
from utils.data_loader import load_data
from utils.stat_utils import fit_distribution, ks_test_normality, calculate_entropy

st.set_page_config(page_title="Advanced Univariate Analysis", page_icon="📈", layout="wide")

st.title("2️⃣ Advanced Univariate Analysis: Moments & Entropies")
st.markdown("Taking distribution analysis beyond simple histograms.")

df = load_data()

# --- Section 1: Distribution Fitting ---
st.header("1. Empirical PDF & Distribution Fitting")
st.markdown("Does the data follow a known theoretical distribution?")

num_col = st.selectbox("Select Numeric Variable:", ['Avg_Daily_Usage_Hours', 'Addicted_Score', 'Sleep_Hours_Per_Night'], index=0)
dist_type = st.radio("Fit Theoretical Distribution:", ["Normal (Gaussian)", "Log-Normal", "Gamma"], horizontal=True)

# Map UI selection to scipy name
dist_map = {"Normal (Gaussian)": "norm", "Log-Normal": "lognorm", "Gamma": "gamma"}
sel_dist = dist_map[dist_type]

# Plot
fig_dist = px.histogram(df, x=num_col, nbins=30, histnorm='pdf', title=f"Empirical vs Theoretical {dist_type} Distribution", opacity=0.6)

# Fit curve
x_vals, pdf_vals, params = fit_distribution(df[num_col], sel_dist)

if x_vals is not None:
    fig_dist.add_trace(go.Scatter(x=x_vals, y=pdf_vals, mode='lines', name=f'Fitted {dist_type}', line=dict(color='red', width=3)))
    st.plotly_chart(fig_dist, use_container_width=True)
    
    st.success(f"**Fitted Parameters for {dist_type}:** {params}")
else:
    st.error("Could not fit distribution.")

# --- Section 2: Rigorous Normality Testing ---
st.header("2. Rigorous Normality Testing")
ks_stat, ks_p = ks_test_normality(df[num_col])

col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Skewness", f"{skew(df[num_col], nan_policy='omit'):.3f}", delta_color="off", help=">0: Right skew, <0: Left skew")
with col2:
    st.metric("Kurtosis", f"{kurtosis(df[num_col], nan_policy='omit'):.3f}", delta_color="off", help=">3: Heavy tails (Leptokurtic)")
with col3:
    st.metric("KS Test P-Value", f"{ks_p:.4e}", help="< 0.05 implies NOT Normal")

if ks_p < 0.05:
    st.warning(f"**Reject Null Hypothesis ($H_0$)**: {num_col} is significantly different from a Normal Distribution.")
else:
    st.success(f"**Fail to Reject $H_0$**: {num_col} could be Normally Distributed.")
    
# --- Section 3: Entropy (Information Content) ---
st.divider()
st.header("3. Categorical Entropy")
st.markdown("Entropy measures the 'unpredictability' or 'information content' of a variable.")

cat_col = st.selectbox("Select Categorical Variable:", ['Most_Used_Platform', 'Academic_Level', 'Gender', 'Country'], index=0)
entropy_val = calculate_entropy(df[cat_col])

st.metric(f"Shannon Entropy (bits)", f"{entropy_val:.3f}")

st.info(f"""
- **Higher Entropy** = More diverse/balanced categories (Harder to predict).
- **Lower Entropy** = Dominated by one category (Easier to predict).
""")

fig_prob = px.bar(df[cat_col].value_counts(normalize=True).reset_index(), x=cat_col, y='proportion', title="Probability Mass Function (PMF)")
st.plotly_chart(fig_prob, use_container_width=True)

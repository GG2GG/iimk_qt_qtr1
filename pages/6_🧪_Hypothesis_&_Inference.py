
import streamlit as st
import pandas as pd
import numpy as np
from scipy import stats
from utils.data_loader import load_data

st.set_page_config(page_title="Hypothesis & Inference", page_icon="🧪", layout="wide")

st.title("6️⃣ Hypothesis Testing & Causal Inference")
st.markdown("Moving from correlation to statistical significance and 'What-If' scenarios.")

df = load_data()

# --- Section 1: Formal Hypothesis Testing ---
st.header("1. Parametric & Non-Parametric Tests")

test_type = st.selectbox("Select Statistical Test:", ["Independent T-Test (Parametric)", "Mann-Whitney U Test (Non-Parametric)", "ANOVA (3+ Groups)"], index=0)

target_col = 'Addicted_Score'
group_col = st.selectbox("Grouping Variable:", ['Gender', 'Affects_Academic_Performance', 'Academic_Level'], index=0)

groups = df[group_col].unique()

if test_type == "Independent T-Test (Parametric)":
    if len(groups) != 2:
        st.error("T-Test requires exactly 2 groups.")
    else:
        g1 = df[df[group_col] == groups[0]][target_col]
        g2 = df[df[group_col] == groups[1]][target_col]
        
        stat, p = stats.ttest_ind(g1, g2, nan_policy='omit')
        
        st.write(f"**Hypothesis:** $H_0: \mu_{{{groups[0]}}} = \mu_{{{groups[1]}}}$")
        col1, col2 = st.columns(2)
        col1.metric("T-Statistic", f"{stat:.4f}")
        col2.metric("P-Value", f"{p:.4e}")
        
        if p < 0.05:
            st.success("Reject Null Hypothesis: Significant difference found.")
        else:
            st.warning("Fail to Reject Null: No significant difference.")

elif test_type == "Mann-Whitney U Test (Non-Parametric)":
    if len(groups) != 2:
        st.error("Mann-Whitney requires 2 groups.")
    else:
        g1 = df[df[group_col] == groups[0]][target_col]
        g2 = df[df[group_col] == groups[1]][target_col]
        
        stat, p = stats.mannwhitneyu(g1, g2)
        st.metric("P-Value", f"{p:.4e}")
        
# --- Section 2: Counterfactual Analysis ---
st.divider()
st.header("2. Counterfactual Simulation (Causal Inference)")
st.markdown("Simulating a 'What-If' scenario: **What if we reduced everyone's social media usage?**")

reduction_hours = st.slider("Reduce Daily Usage by (Hours):", 0.0, 5.0, 2.0, 0.5)

# Simple Linear Model: Addiction = b0 + b1*Usage
# Estimate b1 from data first
slope, intercept, r_value, p_value, std_err = stats.linregress(df['Avg_Daily_Usage_Hours'], df['Addicted_Score'])

st.info(f"**Current Model:** Addiction Score increases by **{slope:.2f}** for every 1 hour of usage.")

# Counterfactual Data
df['Counterfactual_Usage'] = (df['Avg_Daily_Usage_Hours'] - reduction_hours).clip(lower=0)
df['Projected_Addiction'] = df['Addicted_Score'] - (slope * reduction_hours)

current_mean = df['Addicted_Score'].mean()
new_mean = df['Projected_Addiction'].mean()

col_c1, col_c2, col_c3 = st.columns(3)
col_c1.metric("Current Avg Addiction", f"{current_mean:.2f}")
col_c2.metric("Projected Avg Addiction", f"{new_mean:.2f}")
col_c3.metric("Improvement", f"{(current_mean - new_mean):.2f}", delta_color="normal")

st.markdown(f"""
> **Intervention Interpretation:** If we could casually intervene to reduce usage by {reduction_hours} hours for everyone, 
> the model predicts the average Student Addiction Score would drop from {current_mean:.1f} to {new_mean:.1f}.
> *(Note: This assumes the relationship is causal and linear.)*
""")

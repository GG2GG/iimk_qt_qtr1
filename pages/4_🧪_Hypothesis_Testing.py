
import streamlit as st
import pandas as pd
from scipy import stats
from utils.data_loader import load_data

st.set_page_config(page_title="Hypothesis Testing", page_icon="🧪", layout="wide")

st.title("🧪 Hypothesis Testing")
st.markdown("Use statistical tests to validate assumptions about the data.")

df = load_data()

# --- T-Test Section ---
st.header("1. Independent T-Test (Numerical vs Categorical)")
st.markdown("Compare the means of two independent groups to see if they are significantly different.")

col1, col2 = st.columns(2)
with col1:
    group_col = st.selectbox("Select Grouping Variable (Categorical, 2 groups preferred):", ['Gender', 'Affects_Academic_Performance'], index=0)
with col2:
    target_col = st.selectbox("Select Target Variable (Numerical):", ['Addicted_Score', 'Avg_Daily_Usage_Hours', 'Mental_Health_Score'], index=0)

# Get unique groups
unique_groups = df[group_col].unique()

if len(unique_groups) < 2:
    st.error("Grouping variable must have at least 2 unique values.")
else:
    st.write(f"Comparing **{target_col}** between groups in **{group_col}**: {unique_groups}")
    
    group1 = df[df[group_col] == unique_groups[0]][target_col]
    group2 = df[df[group_col] == unique_groups[1]][target_col]
    
    st.markdown(f"""
    **Hypotheses:**
    - $H_0$: There is **NO difference** in mean {target_col} between {unique_groups[0]} and {unique_groups[1]}.
    - $H_1$: There **IS a difference** in mean {target_col} between {unique_groups[0]} and {unique_groups[1]}.
    """)
    
    t_stat, p_val = stats.ttest_ind(group1, group2, nan_policy='omit')
    
    col_res1, col_res2 = st.columns(2)
    with col_res1:
        st.metric("T-Statistic", f"{t_stat:.4f}")
    with col_res2:
        st.metric("P-Value", f"{p_val:.4f}")
        
    alpha = 0.05
    if p_val < alpha:
        st.success(f"**Result: Reject Null Hypothesis ($H_0$)** at alpha={alpha}. \n\nThere is a **statistically significant difference** between the groups.")
    else:
        st.info(f"**Result: Fail to Reject Null Hypothesis ($H_0$)** at alpha={alpha}. \n\nThere is **no statistically significant difference** between the groups.")

# --- Chi-Square Section ---
st.divider()
st.header("2. Chi-Square Test of Independence (Categorical vs Categorical)")
st.markdown("Test if there is a significant association between two categorical variables.")

col_cat1 = st.selectbox("Select Category 1:", ['Gender', 'Academic_Level', 'Country'], index=1)
col_cat2 = st.selectbox("Select Category 2:", ['Most_Used_Platform', 'Relationship_Status', 'Affects_Academic_Performance'], index=0)

contingency_table = pd.crosstab(df[col_cat1], df[col_cat2])
st.write("Contingency Table:")
st.dataframe(contingency_table)

chi2_stat, p_val_chi2, dof, expected = stats.chi2_contingency(contingency_table)

st.markdown(f"""
**Hypotheses:**
- $H_0$: {col_cat1} and {col_cat2} are **independent** (no relationship).
- $H_1$: {col_cat1} and {col_cat2} are **dependent** (relationship exists).
""")

col_chi1, col_chi2 = st.columns(2)
with col_chi1:
    st.metric("Chi-Square Statistic", f"{chi2_stat:.4f}")
with col_chi2:
    st.metric("P-Value", f"{p_val_chi2:.4f}")

if p_val_chi2 < alpha:
    st.success(f"**Result: Reject Null Hypothesis ($H_0$)**. \n\nVariables are **dependent** (statistically significant association).")
else:
    st.info(f"**Result: Fail to Reject Null Hypothesis ($H_0$)**. \n\nVariables appear to be **independent**.")

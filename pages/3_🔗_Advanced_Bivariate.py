
import streamlit as st
import pandas as pd
import plotly.express as px
import numpy as np
from scipy.stats import chi2_contingency
from utils.data_loader import load_data

st.set_page_config(page_title="Advanced Bivariate Analysis", page_icon="🔗", layout="wide")

st.title("3️⃣ Advanced Bivariate: Conditional Probability & Bayes")

df = load_data()

# --- Section 1: Conditional Probability ---
st.header("1. Conditional Probability & Bayes Theorem")
st.markdown(r"Visualizing $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$")

# Inputs for Bayes
col_outcome = 'Affects_Academic_Performance'  # Event A
col_evidence = st.selectbox("Select Evidence Event (B):", ['Gender', 'Most_Used_Platform', 'Relationship_Status'], index=1)

# Get Data
cross_tab = pd.crosstab(df[col_outcome], df[col_evidence], normalize='index') # P(B|A)
marginal_A = df[col_outcome].value_counts(normalize=True) # P(A)
marginal_B = df[col_evidence].value_counts(normalize=True) # P(B)

st.write("### Joint Probability Matrix")
st.dataframe(pd.crosstab(df[col_outcome], df[col_evidence], normalize='all'))

st.subheader("Interactive Bayes Query")
val_ev = st.selectbox(f"Given that a student uses/is:", df[col_evidence].unique())

p_evidence = marginal_B[val_ev]
p_outcome_given_evidence = df[df[col_evidence] == val_ev][col_outcome].value_counts(normalize=True).get('Yes', 0)

st.metric(f"P(Academic Impact | {val_ev})", f"{p_outcome_given_evidence:.2%}")

st.latex(r"""
P(\text{Impact} \mid \text{""" + str(val_ev) + r"""}) = \frac{P(\text{""" + str(val_ev) + r"""} \mid \text{Impact}) \cdot P(\text{Impact})}{P(\text{""" + str(val_ev) + r"""})}
""")

# --- Section 2: Cramer's V ---
st.divider()
st.header("2. Categorical Correlation (Cramér's V)")
st.markdown("Measuring association strength between categorical variables (0 = No association, 1 = Perfect).")

cat_cols = ['Gender', 'Academic_Level', 'Country', 'Most_Used_Platform', 'Relationship_Status', 'Affects_Academic_Performance']

def cramers_v(x, y):
    confusion_matrix = pd.crosstab(x, y)
    chi2 = chi2_contingency(confusion_matrix)[0]
    n = confusion_matrix.sum().sum()
    phi2 = chi2 / n
    r, k = confusion_matrix.shape
    return np.sqrt(phi2 / min(k-1, r-1))

cramers_matrix = pd.DataFrame(index=cat_cols, columns=cat_cols)

for c1 in cat_cols:
    for c2 in cat_cols:
        if c1 == c2:
            cramers_matrix.loc[c1, c2] = 1.0
        else:
            cramers_matrix.loc[c1, c2] = cramers_v(df[c1], df[c2])

cramers_matrix = cramers_matrix.astype(float)

fig_cv = px.imshow(cramers_matrix, text_auto=".2f", color_continuous_scale="Mint", title="Cramér's V Heatmap")
st.plotly_chart(fig_cv, use_container_width=True)

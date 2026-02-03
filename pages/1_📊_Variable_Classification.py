
import streamlit as st
import pandas as pd

st.set_page_config(page_title="Variable Classification", page_icon="📊", layout="wide")

st.title("1️⃣ Variable Classification & Taxonomy")
st.markdown("""
**Formal classification of variables is the first step in rigorous statistical analysis.** 
The data type (Nominal, Ordinal, Interval, Ratio) dictates which mathematical operations and statistical tests are valid.

#### 📌 Classification Table
""")

# Define the classification data
classification_data = [
    {"Column": "Student_ID", "Type": "Identifier", "Scale": "Nominal", "Math Allowed": "❌ None (Indexing only)"},
    {"Column": "Age", "Type": "Numeric", "Scale": "Ratio", "Math Allowed": "✔ All (Mean, SD, Ratio)"},
    {"Column": "Gender", "Type": "Categorical", "Scale": "Nominal", "Math Allowed": "✔ Mode, Entropy, Chi-Square"},
    {"Column": "Academic_Level", "Type": "Categorical", "Scale": "Ordinal", "Math Allowed": "✔ Median, Rank Correlation"},
    {"Column": "Country", "Type": "Categorical", "Scale": "Nominal", "Math Allowed": "✔ Mode, Entropy"},
    {"Column": "Avg_Daily_Usage_Hours", "Type": "Numeric", "Scale": "Ratio", "Math Allowed": "✔ All (Distributions, Moments)"},
    {"Column": "Most_Used_Platform", "Type": "Categorical", "Scale": "Nominal", "Math Allowed": "✔ Mode, Entropy"},
    {"Column": "Affects_Academic_Performance", "Type": "Binary", "Scale": "Nominal", "Math Allowed": "✔ Proportions, Logistic Regression"},
    {"Column": "Sleep_Hours_Per_Night", "Type": "Numeric", "Scale": "Ratio", "Math Allowed": "✔ All (Distributions)"},
    {"Column": "Mental_Health_Score", "Type": "Numeric (Bounded)", "Scale": "Interval", "Math Allowed": "✔ Mean, SD, Correlation (No true zero)"},
    {"Column": "Relationship_Status", "Type": "Categorical", "Scale": "Nominal", "Math Allowed": "✔ Mode, Probabilities"},
    {"Column": "Conflicts_Over_Social_Media", "Type": "Count/Numeric", "Scale": "Ratio", "Math Allowed": "✔ All, Poisson Models"},
    {"Column": "Addicted_Score", "Type": "Numeric", "Scale": "Interval", "Math Allowed": "✔ Mean, SD, Latent Modeling"},
]

df_class = pd.DataFrame(classification_data)

st.table(df_class)

st.info("""
**Key Takeaways:**
- **Ratio scales** (like *Usage Hours*) allow for the most powerful math (Geometric Mean, Coefficient of Variation).
- **Nominal scales** (like *Gender*) are limited to frequency-based analysis (Mode, Entropy).
- **Interval scales** (like *Mental Health Score*) have no "true zero", so ratios (e.g., "twice as depressed") are technically invalid, though often treated as ratio in social sciences.
""")

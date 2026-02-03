
import streamlit as st
import pandas as pd
from utils.data_loader import load_data, get_data_dictionary

st.set_page_config(
    page_title="Social Media Addiction Analysis",
    page_icon="📱",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("📱 Student Social Media Addiction Study")
st.subheader("Quantitative Theory & Data Analysis Project")

st.markdown("""
### Welcome to the Analysis Dashboard
This project explores the impact of social media usage on students' lives, focusing on **addiction**, **mental health**, and **academic performance**.

We will cover:
- **📊 Exploratory Data Analysis (EDA)**: Understanding our demographics.
- **🔗 Bivariate Analysis**: Seeing how variables interact (Correlation & Covariance).
- **🎲 Probability Distributions**: Modeling the data with PDF and PMF.
- **🧪 Hypothesis Testing**: Statistically proving relationships.

Navigate using the sidebar to explore different quantitative concepts!
""")

# Load Data
df = load_data()

if not df.empty:
    with st.expander("📂 View Raw Dataset & Data Dictionary", expanded=False):
        tab1, tab2 = st.tabs(["Raw Data", "Data Dictionary"])
        
        with tab1:
            st.dataframe(df.head(100), use_container_width=True)
            st.caption(f"Showing first 100 rows. Total dataset size: {df.shape[0]} rows, {df.shape[1]} columns.")
            
        with tab2:
            st.table(pd.DataFrame(list(get_data_dictionary().items()), columns=["Column", "Description"]))

    # Key Metrics Row
    st.markdown("### ⚡ Quick Insights")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Students", df.shape[0])
    with col2:
        st.metric("Avg Daily Usage (Hrs)", f"{df['Avg_Daily_Usage_Hours'].mean():.2f} h")
    with col3:
        st.metric("Avg Addiction Score", f"{df['Addicted_Score'].mean():.2f} / 10")
    with col4:
        st.metric("Avg Mental Health Score", f"{df['Mental_Health_Score'].mean():.2f} / 10")

else:
    st.warning("Data not loaded. Please check the 'Students Social Media Addiction.csv' file.")


import streamlit as st
import plotly.express as px
from utils.data_loader import load_data

st.set_page_config(page_title="Exploratory Data Analysis", page_icon="📊", layout="wide")

st.title("📊 Exploratory Data Analysis (EDA)")
st.markdown("Analyze the distribution of individual variables to understand demographics and usage patterns.")

df = load_data()

if df.empty:
    st.error("No data available.")
    st.stop()

# --- Univariate Analysis ---
st.header("1. Univariate Analysis")
st.markdown("Explore the spread and central tendency of key numerical variables.")

# Select variable for distribution
num_cols = ['Age', 'Avg_Daily_Usage_Hours', 'Sleep_Hours_Per_Night', 'Mental_Health_Score', 'Addicted_Score']
selected_col = st.selectbox("Select a variable to visualize distribution:", num_cols, index=1)

col1, col2 = st.columns(2)

with col1:
    st.subheader("Histogram")
    fig_hist = px.histogram(df, x=selected_col, nbins=20, title=f"Distribution of {selected_col}", 
                            marginal="rug", color_discrete_sequence=['#636EFA'])
    st.plotly_chart(fig_hist, use_container_width=True)

with col2:
    st.subheader("Boxplot")
    fig_box = px.box(df, y=selected_col, title=f"Boxplot of {selected_col}", color_discrete_sequence=['#EF553B'])
    st.plotly_chart(fig_box, use_container_width=True)

# --- Categorical Analysis ---
st.header("2. Categorical Analysis")
st.markdown("Understand the composition of our student sample.")

cat_cols = ['Gender', 'Academic_Level', 'Most_Used_Platform', 'Affects_Academic_Performance', 'Relationship_Status']
selected_cat = st.radio("Select categorical variable:", cat_cols, horizontal=True)

fig_bar = px.bar(df[selected_cat].value_counts().reset_index(), x=selected_cat, y='count', 
                 title=f"Count of Students by {selected_cat}", 
                 color=selected_cat, text_auto=True)
st.plotly_chart(fig_bar, use_container_width=True)

# --- Insights Section ---
st.info(f"""
**Observations for {selected_col}:**
- Mean: {df[selected_col].mean():.2f}
- Median: {df[selected_col].median():.2f}
- Standard Deviation: {df[selected_col].std():.2f}
""")

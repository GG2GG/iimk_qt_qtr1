
import streamlit as st
import plotly.express as px
import pandas as pd
import numpy as np
from utils.data_loader import load_data

st.set_page_config(page_title="Bivariate Analysis & Covariance", page_icon="🔗", layout="wide")

st.title("🔗 Bivariate Analysis & Covariance")
st.markdown("Investigate relationships between two variables to find patterns and correlations.")

df = load_data()

# --- Correlation Heatmap ---
st.header("1. Correlation Matrix")
st.markdown("How strongly are numerical variables related?")

numeric_df = df.select_dtypes(include=[np.number])
corr_matrix = numeric_df.corr()

fig_corr = px.imshow(corr_matrix, text_auto=True, aspect="auto", color_continuous_scale="RdBu_r", title="Correlation Heatmap")
st.plotly_chart(fig_corr, use_container_width=True)

# --- Covariance Explanation & Calculation ---
st.header("2. Covariance")
with st.expander("🎓 What is Covariance? (Click to Expand)", expanded=True):
    st.markdown(r"""
    **Covariance** measures the directional relationship between two variables. 
    
    $$
    Cov(X, Y) = \frac{\sum (X_i - \bar{X})(Y_i - \bar{Y})}{N-1}
    $$
    
    - **Positive Covariance**: As one variable increases, the other tends to increase.
    - **Negative Covariance**: As one variable increases, the other tends to decrease.
    - **Zero**: No linear relationship.
    
    *Note: Covariance is not standardized (unlike Correlation), so the magnitude depends on the units of the variables.*
    """)

col_x = st.selectbox("Select Variable X for Covariance:", numeric_df.columns, index=1, key='cov_x')
col_y = st.selectbox("Select Variable Y for Covariance:", numeric_df.columns, index=5, key='cov_y')

cov_value = df[col_x].cov(df[col_y])

st.metric(f"Covariance between {col_x} and {col_y}", f"{cov_value:.4f}")

if cov_value > 0:
    st.success(f"Positive Covariance: {col_x} and {col_y} tend to move in the SAME direction.")
elif cov_value < 0:
    st.warning(f"Negative Covariance: {col_x} and {col_y} tend to move in OPPOSITE directions.")
else:
    st.info("Covariance is near zero.")

# --- Interactive Scatter Plot ---
st.header("3. Interactive Scatter Plot")
st.markdown("Visualize the relationship directly.")

col_scat_color = st.selectbox("Color points by:", ['Gender', 'Academic_Level', 'Most_Used_Platform', 'None'], index=0)
color_arg = None if col_scat_color == 'None' else col_scat_color

fig_scatter = px.scatter(df, x=col_x, y=col_y, color=color_arg, trendline="ols", 
                         title=f"Scatter Plot: {col_x} vs {col_y}", opacity=0.7)
st.plotly_chart(fig_scatter, use_container_width=True)

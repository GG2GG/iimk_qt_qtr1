
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from scipy.stats import norm
from utils.data_loader import load_data

st.set_page_config(page_title="Probability Distributions", page_icon="🎲", layout="wide")

st.title("🎲 Probability Distributions")
st.markdown("Understand the difference between Probability Mass Functions (PMF) and Probability Density Functions (PDF).")

df = load_data()

# --- PMF Section ---
st.header("1. Probability Mass Function (PMF) - Discrete")
st.markdown("""
**PMF** is used for **discrete random variables**. It gives the probability that a discrete random variable is exactly equal to some value.
""")

# Use a discrete variable
pmf_col = st.selectbox("Select Discrete Variable for PMF:", ['Conflicts_Over_Social_Media', 'Academic_Level', 'Gender'], index=0)

# Calculate Probabilities
pmf_data = df[pmf_col].value_counts(normalize=True).sort_index().reset_index()
pmf_data.columns = [pmf_col, 'Probability']

fig_pmf = px.bar(pmf_data, x=pmf_col, y='Probability', 
                 title=f"PMF of {pmf_col}", 
                 text_auto='.2%', color='Probability', color_continuous_scale="Viridis")
fig_pmf.update_layout(yaxis_title="Probability P(X=x)")
st.plotly_chart(fig_pmf, use_container_width=True)

st.info(f"The height of each bar represents the probability of a student having exactly that value for **{pmf_col}**.")

# --- PDF Section ---
st.header("2. Probability Density Function (PDF) - Continuous")
st.markdown("""
**PDF** is used for **continuous random variables**. The area under the curve represents the probability. 
We will fit a **Normal (Gaussian) Distribution** to the data.
""")

pdf_col = st.selectbox("Select Continuous Variable for PDF:", ['Addicted_Score', 'Mental_Health_Score', 'Avg_Daily_Usage_Hours'], index=0)

# Histogram
fig_pdf = px.histogram(df, x=pdf_col, nbins=15, histnorm='probability density', 
                       title=f"Histogram & PDF of {pdf_col}", opacity=0.5, color_discrete_sequence=['lightgray'])

# Fit Normal Distribution
mu, std = norm.fit(df[pdf_col].dropna())
xmin, xmax = df[pdf_col].min(), df[pdf_col].max()
x = np.linspace(xmin, xmax, 100)
p = norm.pdf(x, mu, std)

# Add PDF Line
fig_pdf.add_trace(go.Scatter(x=x, y=p, mode='lines', name='Normal Distribution (PDF)', line=dict(color='red', width=3)))

st.plotly_chart(fig_pdf, use_container_width=True)

st.success(f"""
**Normal Distribution Parameters for {pdf_col}:**
- Mean ($\mu$): {mu:.2f}
- Standard Deviation ($\sigma$): {std:.2f}
""")

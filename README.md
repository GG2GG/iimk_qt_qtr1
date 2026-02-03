# Social Media Addiction Dashboard (Quantitative Theory)

A rigorous statistical dashboard analyzing Student Social Media Addiction using Quantitative Theory.
Migrated from Streamlit to a modern **React (TypeScript) + FastAPI (Python)** architecture.

## 🏗 Architecture

- **Backend**: FastAPI (Python 3.10+)
    - Handles statistical computations (Regression, T-Tests, Distribution Fitting).
    - Uses `statsmodels`, `scikit-learn`, `scipy`.
- **Frontend**: React + Vite (TypeScript)
    - Interactive visualizations using `recharts`.
    - Styled with `TailwindCSS`.

## 🚀 Getting Started

### 1. Backend Setup
Navigate to the `backend/` directory (or root, running as module).

```bash
# Create venv if not exists
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Server
# (Run from project root)
uvicorn backend.main:app --reload
```
Server runs at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
Navigate to the `frontend/` directory.

```bash
cd frontend

# Install dependencies
npm install

# Run Dev Server
npm run dev
```
Client runs at: `http://localhost:5173`

## 📊 Modules

1.  **Variable Classification**: Taxonomy of dataset variables.
2.  **Advanced Univariate**: Distribution fitting (Normal, Log-Normal, Gamma) & Entropy.
3.  **Advanced Bivariate**: Cramér's V Heatmaps.
4.  **Multivariate Analysis**: PCA (Scree Plot, Loadings).
5.  **Statistical Modeling**: OLS Regression Diagnostics.
6.  **Inference**: Hypothesis Testing (T-Tests).
7.  **Metrics**: Inequality (Gini) & Monte Carlo Simulation.
# iimk_qt_qtr1

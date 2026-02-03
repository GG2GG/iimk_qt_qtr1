import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchSummary = async () => {
    const response = await apiClient.get('/summary');
    return response.data;
};

export const fetchRawData = async (limit = 100) => {
    const response = await apiClient.get(`/raw_data?limit=${limit}`);
    return response.data;
};

export const fetchDistData = async (col: string, distType: string) => {
    const response = await apiClient.get(`/eda/dist/${col}?dist_type=${distType}`);
    return response.data;
};

export const fetchCorrelation = async () => {
    const response = await apiClient.post('/bivariate/correlation');
    return response.data;
};

export const runRegression = async (target: string, predictors: string[], modelType: string) => {
    const response = await apiClient.post('/models/regression', {
        target,
        predictors,
        model_type: modelType
    });
    return response.data;
};

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import UnivariatePage from './pages/UnivariatePage';
import BivariatePage from './pages/BivariatePage';
import MultivariatePage from './pages/MultivariatePage';
import ModelingPage from './pages/ModelingPage';
import InferencePage from './pages/InferencePage';
import MetricsPage from './pages/MetricsPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="variables" element={<div className="p-4">Variables Page (See Main Taxonomy)</div>} />
          <Route path="univariate" element={<UnivariatePage />} />
          <Route path="bivariate" element={<BivariatePage />} />
          <Route path="multivariate" element={<MultivariatePage />} />
          <Route path="modeling" element={<ModelingPage />} />
          <Route path="inference" element={<InferencePage />} />
          <Route path="metrics" element={<MetricsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

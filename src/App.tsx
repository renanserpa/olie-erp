import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FornecedorListPage from './pages/FornecedorListPage';
import FornecedorFormPage from './pages/FornecedorFormPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fornecedores" element={<FornecedorListPage />} />
        <Route path="/fornecedores/novo" element={<FornecedorFormPage />} />
        <Route path="/fornecedores/editar/:id" element={<FornecedorFormPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaxForm from './components/TaxForm';
import SubmissionsTable from './components/SubmissionsTable';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/tax-form' : '/login'} />} />
        <Route path="/login" element={<Login onLogin={() => window.location.href = '/tax-form'} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tax-form" element={token ? <TaxForm /> : <Navigate to="/login" />} />
        <Route path="/submissions" element={token ? <SubmissionsTable /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

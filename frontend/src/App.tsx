import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import TaxForm from './TaxForm';
import SubmissionsTable from './SubmissionsTable';

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-green-600">Tailwind is working ✅</h1>

      <h2>📄 1099 Filing Portal</h2>
      {token && <button onClick={handleLogout}>Logout</button>}

      <Routes>
        <Route path="/" element={token ? <TaxForm /> : <Navigate to="/login" />} />
        <Route path="/submissions" element={token ? <SubmissionsTable token={token} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={() => navigate('/')} />} />
        <Route path="/register" element={<Register onRegistered={() => navigate('/login')} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;

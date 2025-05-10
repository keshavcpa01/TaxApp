import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import TaxForm from './components/TaxForm';
import SubmissionsTable from './components/SubmissionsTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/#/login'; // ✅ Ensures redirect works in deployed HashRouter setup
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">📄 1099 Filing Portal</h2>

          {token && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                token ? (
                  <>
                    <TaxForm />
                    <SubmissionsTable token={token} />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegistered={() => navigate('/login')} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;

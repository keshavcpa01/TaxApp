// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaxForm from './components/TaxForm';
import SubmissionsTable from './components/SubmissionsTable';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirmation from './pages/Confirmation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/submissions" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={() => (window.location.href = '/submissions')} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tax-form" element={token ? <TaxForm /> : <Navigate to="/login" />} />
          <Route path="/submissions" element={token ? <SubmissionsTable /> : <Navigate to="/login" />} />
          <Route path="/confirmation" element={token ? <Confirmation /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

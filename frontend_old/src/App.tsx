import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaxForm from './components/TaxForm';
import SubmissionsTable from './components/SubmissionsTable';
import Login from './pages/Login'; // your login page
import Register from './pages/Register'; // your register page

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/submissions" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tax-form" element={token ? <TaxForm /> : <Navigate to="/login" />} />
        <Route path="/submissions" element={token ? <SubmissionsTable /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

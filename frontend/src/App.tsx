import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaxForm from './components/TaxForm';
import SubmissionsTable from './components/SubmissionsTable';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirmation from './pages/Confirmation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  const requireAuth = (element: JSX.Element) =>
    token ? element : <Navigate to="/login" />;

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/submissions" : "/login"} />} />
          <Route
            path="/login"
            element={
              <Login onLogin={() => (window.location.href = '#/submissions')} />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/tax-form" element={requireAuth(<TaxForm />)} />
          <Route path="/submit" element={requireAuth(<TaxForm />)} />
          <Route path="/submissions" element={requireAuth(<SubmissionsTable />)} />
          <Route path="/confirmation" element={requireAuth(<Confirmation />)} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;

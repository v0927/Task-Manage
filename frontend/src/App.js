import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// Componente para redirigir si ya está logueado
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" />} 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ConfirmProvider>
      <ToastProvider>
        <AuthProvider>
          <Toast />
          <ConfirmDialog />
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ConfirmProvider>
  );
}

export default App;
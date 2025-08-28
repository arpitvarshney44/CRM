import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Expenses from './pages/Expenses';
import Development from './pages/Development';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Leads />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Clients />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Expenses />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/development"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Development />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Analytics />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Messages />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Users />
                  </Layout>
                </RoleProtectedRoute>
              }
            />
          </Routes>
        </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
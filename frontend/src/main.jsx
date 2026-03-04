import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CodeEditorPage from './pages/CodeEditorPage'
import ReviewResultPage from './pages/ReviewResultPage'
import ReviewHistoryPage from './pages/ReviewHistoryPage'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/dashboard" replace /> : children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><CodeEditorPage /></ProtectedRoute>} />
        <Route path="/result/:id" element={<ProtectedRoute><ReviewResultPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ReviewHistoryPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

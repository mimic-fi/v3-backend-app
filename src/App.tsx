import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ErrorAlert from './components/ErrorAlert'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [error, setError] = useState<string | null>(null);

  const closeError = () => setError(null)
  const showError = (message: string) => setError(message)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsLoggedIn(true)
  }, [])

  return (
    <Router>
      {error && <ErrorAlert message={error} onClose={closeError} />}
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} showError={showError} />}/>
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={() => setIsLoggedIn(false)} showError={showError} /> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  )
}

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, HashRouter } from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ErrorAlert from './components/ErrorAlert'

const queryClient = new QueryClient()


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const closeError = () => setError(null)
  const showError = (message: string) => setError(message)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsLoggedIn(true)
  }, [])
  const queryClient = new QueryClient()

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient} >
        {error && <ErrorAlert message={error} onClose={closeError} />}
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} showError={showError} />} />
          <Route path="/dashboard/*" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </QueryClientProvider>
    </HashRouter>
  )
}

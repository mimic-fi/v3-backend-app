import React, { useState } from 'react'
import axios from 'axios'

const URL = process.env.REACT_APP_SERVER_BASE_URL

interface LoginFormProps {
  onLogin: () => void
  showError: (message: string) => void
}

export default function Login({ onLogin, showError }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${URL}/login`, { email, password })
      const token: string = response.data.token
      localStorage.setItem('token', token)
      onLogin()
    } catch (error: any) {
      console.log(error)
      showError(error.response.data.content.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}

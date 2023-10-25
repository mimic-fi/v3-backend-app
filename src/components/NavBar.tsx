import React from 'react'
import { Link } from 'react-router-dom'

interface NavBarProps {
  onLogout: () => void
}

export default function NavBar({ onLogout }: NavBarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
  }

  return (
    <div className="nav-bar">
      <Link to="/api">API</Link>
      <Link to="/price-oracle">Price Oracle</Link>
      <Link to="/relayer-executor">Relayer Executor</Link>
      <Link to="/token-monitor">Token Monitor</Link>
      <Link to="/token-registry">Token Registry</Link>
      <Link to="/web3">Web3</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

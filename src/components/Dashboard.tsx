import React from 'react'
import { Route, Routes } from 'react-router-dom'

import NavBar from './NavBar'
import ApiSettings from './settings/ApiSettings'
import PriceOracleSettings from './settings/PriceOracleSettings'
import RelayerExecutorSettings from './settings/RelayerExecutorSettings'
import TokenRegistrySettings from './settings/TokenRegistrySettings'
import TokenMonitorSettings from './settings/TokenMonitorSettings'
import Web3Settings from './settings/Web3Settings'

interface DashboardProps {
  onLogout: () => void
  showError: (message: string) => void
}

export default function Dashboard({ onLogout, showError }: DashboardProps) {
  return (
    <div>
      <div>
        <NavBar onLogout={onLogout} />
        <div className="dashboard-content">
          <Routes>
            <Route path="/api" element={<ApiSettings/>}/>
            <Route path="/price-oracle" element={<PriceOracleSettings/>}/>
            <Route path="/relayer-executor" element={<RelayerExecutorSettings/>}/>
            <Route path="/token-monitor" element={<TokenMonitorSettings/>}/>
            <Route path="/token-registry" element={<TokenRegistrySettings/>}/>
            <Route path="/web3" element={<Web3Settings/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

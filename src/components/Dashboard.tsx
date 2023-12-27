import { Route, Routes } from 'react-router-dom'
import NavBar from './NavBar'
import ApiSettings from '../pages/ApiSettings'
import PriceOracleSettings from '../pages/PriceOracleSettings'
import RelayerExecutorSettings from '../pages/RelayerExecutorSettings'
import TokenRegistrySettings from '../pages/TokenRegistrySettings'
import TokenListSettings from '../pages/TokenListSettings'
import TokenMonitorSettings from '../pages/TokenMonitorSettings'
import Web3Settings from '../pages/Web3Settings'
import styled from 'styled-components'
import bg from '../assets/background-dashboard.png'

interface DashboardProps {
  onLogout: () => void
  showError: (message: string) => void
}

export default function Dashboard({ onLogout, showError }: DashboardProps) {
  console.log(showError)
  return (
    <DashboardSection>
      <NavBar onLogout={onLogout} />
      <DashboardContainer background={bg}>
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<ApiSettings />} />
            <Route path="/api" element={<ApiSettings />} />
            <Route path="/price-oracle" element={<PriceOracleSettings />} />
            <Route
              path="/relayer-executor"
              element={<RelayerExecutorSettings />}
            />
            <Route path="/token-monitor" element={<TokenMonitorSettings />} />
            <Route path="/token-registry" element={<TokenRegistrySettings />} />
            <Route path="/token-list" element={<TokenListSettings />} />
            <Route path="/web3" element={<Web3Settings />} />
          </Routes>
        </div>
      </DashboardContainer>
    </DashboardSection>
  )
}

interface DashProps {
  background: string
}

const DashboardSection = styled.div`
  height: 100vh;
`

const DashboardContainer = styled.div<DashProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: url(${props => props.background}) no-repeat;
  background-size: cover;
  padding: 30px 0;

  .dashboard-content {
    flex-grow: 1;
  }

  input {
    display: block;
    margin-bottom: 20px;
    min-width: 300px;
    height: 40px;
    padding: 0 10px;
    border-radius: 7px;
    border: 0px;
    font-family: 'DMSans';
    font-size: 15px;
  }
  label {
    color: white;
    font-size: 18px;
    margin: 0;
    font-family: 'DMSansBold';
    font-weight: bold;
    font-style: normal;
    line-height: 180%;
    margin-bottom: 50px;
    @media only screen and (max-width: 800px) {
      font-size: 12px;
    }
  }
  button {
    display: inline-block;
    width: auto;
    padding: 10px 24px;
    border-radius: 16px;
    border: 0px;
    background: #6f5ce6;
    font-family: 'DMSans';
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    text-align: center;
    cursor: pointer;
    color: #ffffff;
    margin-top: 20px;
    &:hover {
      background: #582ea0;
    }
  }
  button.white {
    background: white;
    color: #582ea0;
  }
  h2 {
    font-size: 30px;
    margin-top: 60px;
    margin-bottom: 20px;
  }
`

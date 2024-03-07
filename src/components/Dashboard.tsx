import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import ApiSettings from '../pages/ApiSettings';
import Status from '../pages/Status';
import PriceOracle from '../pages/PriceOracle';
import RelayerExecutorSettings from '../pages/RelayerExecutorSettings';
import TokenRegistry from '../pages/TokenRegistry';
import TokenList from '../pages/TokenList';
import TokenMonitors from '../pages/TokenMonitors';
import Web3 from '../pages/Web3';
import Jobs from '../pages/Jobs';
import styled from 'styled-components';
import bg from '../assets/background-dashboard.png';
import Environments from '../pages/Environments';
import EcoMode from '../pages/EcoMode';
import LogsPage from '../pages/LogsPage';
import LogsGroup from '../pages/LogsGroup';
import LogsItem from '../pages/LogsItem';
import Logs from '../pages/Logs';
import Monitor from '../pages/Monitor';

interface DashboardProps {
  onLogout: () => void;
  showError: (message: string) => void;
}

export default function Dashboard({ onLogout, showError }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [storedPath, setStoredPath] = useState<string | null>(localStorage.getItem('currentPath') || null);

  useEffect(() => {
    const path = localStorage.getItem('currentPath');
    if (storedPath) {
      setStoredPath(path);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== storedPath) {
      setStoredPath(location.pathname);
      localStorage.setItem('currentPath', location.pathname);
    }
  }, [location.pathname, storedPath]);

  const handleLogout = () => {
    localStorage.removeItem('currentPath');
    onLogout();
  };

  return (
    <DashboardSection>
      <NavBar onLogout={handleLogout} />
      <DashboardContainer background={bg}>
        <div className="dashboard-content">
          <Routes>
            <Route
              path="/relayer-executor"
              element={<RelayerExecutorSettings />}
            />
            <Route
              path="/relayer-executor/:tab"
              element={<RelayerExecutorSettings />}
            />
            <Route path="/status" element={<Status />} />
            <Route path="/status/logs/groups" element={<LogsGroup />} />
            <Route path="/status/logs/:id/groups" element={<LogsItem />} />
            <Route path="/status/:tab" element={<Status />} />
            <Route path="/api" element={<ApiSettings />} />
            <Route path="/price-oracle" element={<PriceOracle />} />
            <Route path="/token-monitor" element={<TokenMonitors />} />
            <Route path="/token-registry" element={<TokenRegistry />} />
            <Route path="/token-list" element={<TokenList />} />
            <Route path="/web3" element={<Web3 />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<Jobs />} />
            <Route path="/environments" element={<Environments />} />
            <Route path="/environments/:id" element={<Environments />} />
            <Route path="/environments" element={<Environments />} />
            <Route path="/environments/:id/logs" element={<Logs />} />
            <Route path="/environments/:id/monitor" element={<Monitor />} />
            <Route path="/eco-mode" element={<EcoMode />} />
            <Route path="/" element={<Status />} />
          </Routes>
        </div>
      </DashboardContainer>
    </DashboardSection>
  );
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
  min-height: calc(100vh - 80px);

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
  /* button {
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
  } */
  h2 {
    font-size: 30px;
    margin-top: 60px;
    margin-bottom: 20px;
  }

  .green {
    color:   #33C2B0;
  }
  .yellow {
    color: #FFCC33;
  }
  .orange {
    color: #ff8927;
  }
  .red {
    color: #DE0000;
  }
  .pointer {
    cursor: pointer;
  }
`

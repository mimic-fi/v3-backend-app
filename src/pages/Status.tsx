import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusRelayer from './StatusRelayer';
import StatusCrons from './StatusCrons';
import StatusTransactions from './StatusTransactions'
import StatusWallets from './StatusWallets'
import StatusSubgraphs from './StatusSubgraphs'
import LogsPage from './LogsPage'
import styled from 'styled-components';
import { Tab } from '../utils/styles';

export default function Status() {
  const [activeTab, setActiveTab] = useState('relayer');
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/status/${tab}`);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('relayer')}
          className={activeTab === 'relayer' ? 'active' : ''}
        >
          Relayer
        </button>
        <button
          onClick={() => handleTabClick('crons')}
          className={activeTab === 'crons' ? 'active' : ''}
        >
          Crons
        </button>
        <button
          onClick={() => handleTabClick('transactions')}
          className={activeTab === 'transactions' ? 'active' : ''}
        >
          Transactions
        </button>
        <button
          onClick={() => handleTabClick('wallets')}
          className={activeTab === 'wallets' ? 'active' : ''}
        >
          Wallets
        </button>
        <button
          onClick={() => handleTabClick('subgraphs')}
          className={activeTab === 'subgraphs' ? 'active' : ''}
        >
          Subgraphs
        </button>
        <button
          onClick={() => handleTabClick('logs')}
          className={activeTab === 'logs' ? 'active' : ''}
        >
          Logs
        </button>
      </Tab>
      <div>
        {activeTab === 'relayer' && <StatusRelayer />}
        {activeTab === 'crons' && <StatusCrons />}
        {activeTab === 'transactions' && <StatusTransactions />}
        {activeTab === 'wallets' && <StatusWallets />}
        {activeTab === 'subgraphs' && <StatusSubgraphs />}
        {activeTab === 'logs' && <LogsPage />}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RelayerExecutorForm from '../components/RelayerExecutorForm';
import RelayerExecutorSmartVaults from './RelayerExecutorSmartVaults';
import RelayerExecutorChains from './RelayerExecutorChains';
import RelayerExecutorTasks from './RelayerExecutorTasks';
import styled from 'styled-components';

export default function RelayerExecutorSettings() {
  const [activeTab, setActiveTab] = useState('settings');
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/relayer-executor/${tab}`);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('settings')}
          className={activeTab === 'settings' ? 'active' : ''}
        >
          Settings
        </button>
        <button
          onClick={() => handleTabClick('smartVault')}
          className={activeTab === 'smartVault' ? 'active' : ''}
        >
          Smart Vaults
        </button>
        <button
          onClick={() => handleTabClick('chains')}
          className={activeTab === 'chains' ? 'active' : ''}
        >
          Chains
        </button>
        <button
          onClick={() => handleTabClick('tasks')}
          className={activeTab === 'tasks' ? 'active' : ''}
        >
          Tasks
        </button>
      </Tab>
      <div>
        {activeTab === 'settings' && <RelayerExecutorForm />}
        {activeTab === 'smartVault' && <RelayerExecutorSmartVaults />}
        {activeTab === 'chains' && <RelayerExecutorChains />}
        {activeTab === 'tasks' && <RelayerExecutorTasks />}
      </div>
    </div>
  );
}

const Tab = styled.div`
  width: 100%;
  background: #6f5ce6;
  padding: 0;
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    margin-top: 0!important;
    border-radius: 0!important;
    padding: 10px 15px;
    cursor: pointer;
    border: none;
    background: none;
    color: white;
    font-size: 16px;

    &.active {
      border-bottom: 2px solid white;
    }

    &:not(:last-child) {
      margin-right: 20px;
    }
  }
`;

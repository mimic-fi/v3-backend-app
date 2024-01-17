import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RelayerExecutorForm from '../components/RelayerExecutorForm';
import RelayerExecutorSmartVaults from './RelayerExecutorSmartVaults';
import RelayerExecutorChains from './RelayerExecutorChains';
import RelayerExecutorTasks from './RelayerExecutorTasks';
import NetworkThresholds from './NetworkThresholds';
import styled from 'styled-components';
import { Tab } from '../utils/styles';

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
        <button
          onClick={() => handleTabClick('thresholds')}
          className={activeTab === 'thresholds' ? 'active' : ''}
        >
          Networks Thresholds
        </button>
      </Tab>
      <div>
        {activeTab === 'settings' && <RelayerExecutorForm />}
        {activeTab === 'smartVault' && <RelayerExecutorSmartVaults />}
        {activeTab === 'chains' && <RelayerExecutorChains />}
        {activeTab === 'tasks' && <RelayerExecutorTasks />}
        {activeTab === 'thresholds' && <NetworkThresholds />}
      </div>
    </div>
  );
}

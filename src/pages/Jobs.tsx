import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Executor from './JobsExecutor';
import Monitor from './JobsMonitor';
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
    navigate(`/dashboard/jobs/${tab}`);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('executor')}
          className={activeTab === 'executor' ? 'active' : ''}
        >
          Executor
        </button>
        <button
          onClick={() => handleTabClick('monitor')}
          className={activeTab === 'monitor' ? 'active' : ''}
        >
          Monitor
        </button>
      </Tab>
      <div>
        {activeTab === 'executor' && <Executor />}
        {activeTab === 'monitor' && <Monitor />}
      </div>
    </div>
  );
}

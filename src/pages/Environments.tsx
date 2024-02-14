import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Monthly from './EnvironmentsMonthly';
import Yearly from './EnvironmentsYearly';
import styled from 'styled-components';
import { Tab } from '../utils/styles';

export default function Environments() {
  const [activeTab, setActiveTab] = useState('monthly');
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/environments/${tab}`);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('monthly')}
          className={activeTab === 'monthly' ? 'active' : ''}
        >
          Monthly
        </button>
        <button
          onClick={() => handleTabClick('yearly')}
          className={activeTab === 'yearly' ? 'active' : ''}
        >
          Yearly
        </button>
      </Tab>
      <div>
        {activeTab === 'monthly' && <Monthly />}
        {activeTab === 'yearly' && <Yearly />}
      </div>
    </div>
  );
}

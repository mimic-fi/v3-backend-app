import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EnvironmentsMonthly from './EnvironmentsMonthly';
import EnvironmentsYearly from './EnvironmentsYearly';
import { Tab } from '../utils/styles';
import EnvironmentsList from './EnvironmentsList';

export default function Environments() {
  const [activeTab, setActiveTab] = useState('list');
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
          onClick={() => handleTabClick('list')}
          className={activeTab === 'list' ? 'active' : ''}
        >
          List
        </button>
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
        {activeTab === 'list' && <EnvironmentsList />}
        {activeTab === 'monthly' && <EnvironmentsMonthly />}
        {activeTab === 'yearly' && <EnvironmentsYearly />}
      </div>
    </div>
  );
}

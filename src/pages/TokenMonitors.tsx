import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Network from '../utils/Network';
import Address from '../utils/Address';
import Token from '../components/Token';
import JobsMonitor from './JobsMonitor';
import TokenMonitorForm from '../components/TokenMonitorForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import { ContainerTable, Filter, Filters, Tab } from '../utils/styles';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { refresh } from '../utils/web3-utils';

interface TokenMonitorSetting {
  environment: string;
  address: string;
  chainId: number;
  tokens: string[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;


function Tabs() {
  const [activeTab, setActiveTab] = useState('monitors');


  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('monitors')}
          className={activeTab === 'monitors' ? 'active' : ''}
        >
          Monitors
        </button>
        <button
          onClick={() => handleTabClick('job')}
          className={activeTab === 'job' ? 'active' : ''}
        >
          Job
        </button>
      </Tab>
      <div>
        {activeTab === 'monitors' && <TokenMonitors />}
        {activeTab === 'job' && <JobsMonitor /> }
      </div>
    </div>
  );
}

const TokenMonitors: React.FC = () => {
  const [
    tokenMonitorsData,
    setTokenMonitors,
  ] = useState<TokenMonitorSetting[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState({
    address: '',
    chainId: 0,
  });
  const [chainFilter, setChainFilter] = useState<string>('');
  const [environmentFilter, setEnvironmentFilter] = useState<string>('');

  const fetchTokenMonitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<TokenMonitorSetting[]>(
        `${URL}/token-monitor/monitors`,
        {
          params: {
            ...(chainFilter !== '' && { chainId: chainFilter }),
            ...(environmentFilter !== '' && { environment: environmentFilter }),
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      const sortedData = [...response.data];
      sortedData.sort((a, b) => a.address.localeCompare(b.address));
      setTokenMonitors(sortedData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchTokenMonitors();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Token monitor error:', error);
    }
  };

  useEffect(() => {
    fetchTokenMonitors();
  }, [environmentFilter, chainFilter]);

  const handleDeleteClick = (address: string, chainId: number) => {
    setDeleteParams({ address, chainId });
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { address, chainId } = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/token-monitor/monitors/${chainId}/${address}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });

      fetchTokenMonitors();
      toast.success('Token monitor successfully deleted');

    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error deleting the token monitor:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  const handleChainFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChainFilter(event.target.value);
  };

  const handleEnvironmentFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnvironmentFilter(event.target.value);
  };

  function compare(a: TokenMonitorSetting, b: TokenMonitorSetting): number {
    return a.environment.localeCompare(b.environment);
  }

  if (tokenMonitorsData) {
    tokenMonitorsData.sort(compare);
  }

  return (
    <TokenMonitorSection>
      <TokenMonitorForm onSuccess={fetchTokenMonitors} />
      <Filters>
        <Filter>
          <label>Chain</label>
          <input type="number" placeholder="Filter by Chain" value={chainFilter} onChange={handleChainFilterChange} />
        </Filter>
        <Filter>
          <label>Environment</label>
          <input type="text" placeholder="Filter by Environment" value={environmentFilter} onChange={handleEnvironmentFilterChange} />
        </Filter>
      </Filters>
      {tokenMonitorsData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Environment</th>
                <th>Address</th>
                <th>Chain ID</th>
                <th>Tokens</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tokenMonitorsData.map((setting, index) => (
                <tr key={index}>
                  <td><Address
                    address={setting.environment}
                    short={true}
                    showIdentity={false}
                    withLink={false}
                    chainId={setting.chainId}/></td>
                  <td>
                    <Address
                      address={setting.address}
                      short={true}
                      chainId={setting.chainId}/>
                  </td>
                  <td>
                    <Network network={setting.chainId} width={1200} />
                  </td>
                  <td>
                    <TokenContainer>
                      <Token tokens={setting?.tokens} chain={setting.chainId} />
                    </TokenContainer>

                  </td>
                  <td>
                    {setting?.tokens?.length}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(setting.address, setting.chainId)
                      }
                      src={deleteIcon}
                      alt="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>{' '}
          {customModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this token monitor?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </TokenMonitorSection>
  );
};

const TokenContainer = styled.div`
  display: flex;
  max-width: 400px;
  flex-wrap: wrap;
`

const TokenMonitorSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  max-width: 85%;
  table {
    max-width: 100%;
  }
`;

export default Tabs;

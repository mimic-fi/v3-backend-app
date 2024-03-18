// @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ContainerTable, Section, FlexButtons, LoadingTable } from '../utils/styles';
import Address from '../utils/Address';
import Network from '../utils/Network';
import styled from 'styled-components'

interface EnvironmentsProps {
  onSuccess?: () => void;
}

interface ResponseData {
  name: string;
  simulations?: number;
  executions?: number;
  volume?: number;
  fees?: number;
  gasUsed?: number;
  gasCharged?: number;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const EnvironmentsMonthly: React.FC<EnvironmentsProps> = ({ onSuccess = () => { } }) => {
  const [activeTab, setActiveTab] = useState('simulations');
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const token = localStorage.getItem('token');
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  useEffect(() => {
    fetchDataForCurrentYear();
  }, [activeTab]);

  const fetchDataForCurrentYear = async () => {
    try {
      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = new Date(lastDayOfMonth.getTime() + (24 * 60 * 60 * 1000) - 1).toISOString().split('T')[0];

      const promise = axios.get(`${URL}/relayer-executor/environments/report/${activeTab}`, {
        params: {
          startDate,
          endDate,
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      const response = await promise;


      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const networks = [1, 10, 56, 100, 137, 250, 1101, 8453, 42161, 43114, 1313161554];

  return (
    <Section>
      <h2>{currentDate.toLocaleString('en-US', { month: 'long' })}</h2>
      <FlexButtons>
        <Details
          selected={activeTab === 'simulations'}
          onClick={() => handleTabClick('simulations')}>
          Accounting
          </Details>
        <Details
          selected={activeTab === 'gas' }
          onClick={() => handleTabClick('gas')}>
          Gas
        </Details>
        <Details
          selected={activeTab === 'volume' }
          onClick={() => handleTabClick('volume')}>
          Executions
        </Details>
      </FlexButtons>
      <Box>
        {Object.keys(data).length === 0 ? <LoadingTable>Loading...</LoadingTable> :
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Environment</th>
                {networks.map((network, index) => (
                  <th key={index}><Network network={network} width={1200} /></th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([externalKey, internalData]) => (
                <>
                  <tr key={externalKey}>
                    <td className="accent">{Object.values(data[externalKey])[0].name}</td>
                    <td>
                      <Address
                        address={externalKey}
                        short={true}
                        showIdentity={false}
                        withLink={false}
                        chainId={1} />
                    </td>
                    {networks.map((network, index) => {
                      return (
                        <td className="networks" key={index}>
                          <div>
                            {activeTab === 'simulations' &&
                              <>
                                Simulations: {internalData[network] ?.simulations ? <span className="accent-2">{internalData[network]?.simulations}</span> : '0'}<br />
                                Executions: {internalData[network] ?.executions ? <span className="accent-2">{internalData[network]?.executions}</span> : '0'}
                              </>
                            }
                            {activeTab === 'gas' &&
                              <>
                                Charged: {internalData[network] ?.gasCharged ? <span className="accent-2">$ {internalData[network]?.gasCharged?.toFixed(2)}</span> : '$ 0'}<br />
                                Used: {internalData[network] ?.gasUsed ? <span className="accent-2">$ {internalData[network]?.gasUsed?.toFixed(2)}</span> : '$ 0'}<br />
                              </>
                            }
                            {activeTab === 'volume' &&
                              <>
                                Volume: {internalData[network] ?.volume ? <span className="accent-2">$ {internalData[network]?.volume?.toFixed(2)}</span> : '$ 0'}<br />
                                Fees: {internalData[network] ?.fees ? <span className="accent-2">$ {internalData[network]?.fees?.toFixed(2)}</span> : '$ 0'}
                              </>
                            }
                          </div>
                        </td>
                      )
                    }
                    )}
                    <td className="networks"><div>
                      {activeTab === 'simulations' &&
                        <>
                          Simulations: <span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.simulations, 0)}</span><br />
                          Executions: <span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.executions, 0)}</span>
                        </>
                      }
                      {activeTab === 'gas' &&
                        <>
                          Gas Charged:<span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.gasCharged, 0).toFixed(2)}</span><br />
                          Gas Used: <span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.gasUsed, 0).toFixed(2)}</span><br />
                        </>
                      }
                      {activeTab === 'volume' &&
                        <>
                          Volume: <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.volume, 0).toFixed(2)}</span><br />
                          Fees: <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.fees, 0).toFixed(2)}</span><br />
                        </>
                      }
                    </div>
                    </td>
                  </tr>
                  <tr className="empty-row"></tr>
                </>
              ))}
            </tbody>
          </Table>}
      </Box>
    </Section>
  );
};

const Table = styled(ContainerTable)`
  overflow-x: auto;
  max-width: 100%;
  position: relative;

  td.networks{
    min-width: 156px;
  }
  .accent {
    color: #33C2B0;
    font-wight: bold;
    font-family: 'DMSansBold';
  }
  .accent-2 {
    color: #ff975f;
    font-wight: bold;
    font-family: 'DMSansBold';
  }

  th:first-child {
    min-width: 200px;
    max-width: 200px;
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #2D2C44;
  }

  tbody {
    tr {
      td:first-child {
        position: sticky;
        left: 0;
        background-color: #2D2C44;
      }
    }
  }
`

export const Details = styled.button`
  display: flex;
  justify-items: center;
  align-items: center;
  background: ${(props) => (!props.selected ? " rgba(168, 154, 255, 0.10)" : "#6F5CE6")} !important;
  transition: background-color 0.3s ease;
  color: white;
  border: 0px;
  padding: 10px 15px;
  border-radius: 10px;
  margin-right: 20px;
  height: 50px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    background: rgba(239, 239, 239, 0.3);
    color: rgba(16, 16, 16, 0.3);
  }

  &:hover {
    background: ${(props) => props.theme.main};
  }
`;

const Box = styled.div`
  display: block;
  max-width: 90%;
  overflow: scroll;
`

export default EnvironmentsMonthly;

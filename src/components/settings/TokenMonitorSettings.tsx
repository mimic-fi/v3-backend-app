import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Network from '../utils/Network'

interface TokenMonitorSetting {
  address: string;
  chainId: number;
  tokens: string[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const TokenMonitorSettings: React.FC = () => {
  const [
    tokenMonitorSettings,
    setTokenMonitorSettings,
  ] = useState<TokenMonitorSetting[] | null>(null);

  useEffect(() => {
    const fetchTokenMonitorSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<TokenMonitorSetting[]>(
          `${URL}/token-monitor/monitors`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-type': 'application/json',
              'x-auth-token': `${token}`,
            },
          }
        );

        const sortedData = [...response.data];
        sortedData.sort((a, b) => a.address.localeCompare(b.address));
        setTokenMonitorSettings(sortedData);
        console.log('response', response.data);
      } catch (error) {
        console.error('Token monitor error:', error);
      }
    };

    fetchTokenMonitorSettings();
  }, []);

  return (
    <TokenMonitorSection>
      <h2>Token Monitor Settings:</h2>
      {tokenMonitorSettings ? <> <Table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Chain ID</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {tokenMonitorSettings.map((setting) => (
              <tr key={setting.address}>
                <td>{setting.address}</td>
                <td><Network network={setting.chainId} width={1200}/></td>
                <td>{}</td>
              </tr>
            ))}
          </tbody>
        </Table></> : <p>Loading...</p>}
    </TokenMonitorSection>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #272a38;
    font-size: 18px;
  }
`;

const TokenMonitorSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 874px;
`;

export default TokenMonitorSettings;

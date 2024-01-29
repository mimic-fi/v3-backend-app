import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import Network from '../utils/Network';
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface Status {
  transactions?: {
    id: number;
    date: string;
  };
  nonces?: {
    [key: string]: {
      onChain: number;
      local: number;
    };
  };
}

interface NoncesData {
  [key: number ]: {
    onChain: number;
    local: number;
  };
}

interface Balances {
  [key: string]: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const NoncesTable: React.FC<{ name: string; nonceData: NoncesData; balances: Balances | null }> = ({ name, nonceData, balances }) => {
  return (
    <div>
      <h2>{name}</h2>
      <ContainerTable>
        <thead>
          <tr>
            <th>Chain</th>
            <th>On Chain</th>
            <th>Local</th>
            <th>Balances</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries<any>(nonceData).map(([key, value], index) => (
            <tr key={index}>
              <td><Network network={key} width={1200} /></td>
              <td>{value.onChain}</td>
              <td>{value.local}</td>
              <td>{(balances && key in balances) ? balances[key] : ''}</td>
            </tr>
          ))}
        </tbody>
      </ContainerTable>
    </div>
  );
};


const StatusRelayer: React.FC = () => {
  const [
    statusData,
    setData,
  ] = useState<Status | null>(null);
  const [
    balances,
    setBalances,
  ] = useState<{ [key: string]: Balances }>({});
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Status>(
        `${URL}/relayer-executor/transactions/report`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchData();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error loading the data:', error);
    }
  };

  const fetchBalances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ [key: string]: Balances }>(
        `${URL}/web3/wallets/balances`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setBalances(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchBalances();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error loading the data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBalances();
  }, []);


  return (
    <Section>
      {statusData ? (
        <>{statusData.nonces && Object.entries(statusData.nonces).map(([key, value]) => (
        <NoncesTable name={key} nonceData={value} balances={(balances && key in balances) ? balances[key] : null} />
      ))}</>
      ) : (
        <p>Loading...</p>
      )}
    </Section>
  );
};


const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

export default StatusRelayer;

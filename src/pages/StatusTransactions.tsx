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
  transactions: {
    id: number;
    date: string;
  };
  nonces: object;
}


const URL = process.env.REACT_APP_SERVER_BASE_URL;

const StatusRelayer: React.FC = () => {
  const [
    statusData,
    setData,
  ] = useState<Status | null>(null);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Section>
      {statusData ? (
        <ContainerTable>
          <thead>
            <tr>
              <th>Chain</th>
              <th>Success</th>
              <th>Pending</th>
              <th>Missing</th>
              <th>Failed</th>

            </tr>
          </thead>
          <tbody>
            {Object.entries<any>(statusData?.transactions).map(([key, value], index) => (
              <tr key={index}>
                <td><Network network={key} width={1200} /></td>
                <td className="green">{value.success}</td>
                <td className="yellow">{value.pending}</td>
                <td className="orange">{value.missing}</td>
                <td className="red">{value.failed}</td>
              </tr>
            ))}
          </tbody>
        </ContainerTable>
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

  td.green {
    color:   #33C2B0;
  }
  td.yellow {
    color: #FFCC33;
  }
  td.orange {
    color: #ff8927;
  }
  td.red {
    color: #DE0000;
  }
`;



export default StatusRelayer;

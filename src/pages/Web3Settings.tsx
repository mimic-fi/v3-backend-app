import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ContainerTable, LittleButton } from '../utils/styles';
import moment from 'moment';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import Web3Form from '../components/Web3Form';
import deleteIcon from '../assets/delete.png';
import { refresh } from '../utils/web3-utils';

interface Web3Data {
  name: string;
  chainId: number;
  nativeTokenSymbol: string;
  rpcQueryEndpoints: string[];
  rpcExecutionEndpoints: string[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const Web3Settings: React.FC = () => {
  const [web3Data, setWeb3Data] = useState<Web3Data[] | null>(null);
  const [deleteParams, setDeleteParams] = useState<number | null>(null);

  const fetchWeb3Data = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Web3Data[]>(`${URL}/web3/networks`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      setWeb3Data(response.data);
    } catch (error: any) {
      console.error('Web3 data error:', error);
      if (error.response.status === 401) {
        try {
          await refresh();
          await fetchWeb3Data();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
    }
  };

  useEffect(() => {
    fetchWeb3Data();
  }, []);

  const handleDeleteClick = (index: number) => {
    setDeleteParams(index);
  };

  const handleConfirmDelete = async () => {
    if (deleteParams !== null) {
      const web3Item = web3Data && web3Data[deleteParams];
      if (!web3Item) return;

      const token = localStorage.getItem('token');
      const url = `${URL}/web3/networks/${web3Item.chainId}`;

      try {
        await axios.delete(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        });

        fetchWeb3Data();
      } catch (error) {
        console.error('There was an error deleting the network:', error);
      }

      setDeleteParams(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteParams(null);
  };

  return (
    <Section>
      <Web3Form onSuccess={fetchWeb3Data} />
      {web3Data ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Chain ID</th>
                <th>Native Token Symbol</th>
                <th>RPC Query Endpoints</th>
                <th>RPC Execution Endpoints</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {web3Data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.chainId}</td>
                  <td>{item.nativeTokenSymbol}</td>
                  <td>
                    {item.rpcQueryEndpoints.map((endpoint, endpointIndex) => (
                      <div key={endpointIndex}>{endpoint}</div>
                    ))}
                  </td>
                  <td>
                    {item.rpcExecutionEndpoints.map((endpoint, endpointIndex) => (
                      <div key={endpointIndex}>{endpoint}</div>
                    ))}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(index)
                      }
                      src={deleteIcon}
                      alt="Eliminar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>
          {deleteParams !== null && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this network?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </>
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

export default Web3Settings;

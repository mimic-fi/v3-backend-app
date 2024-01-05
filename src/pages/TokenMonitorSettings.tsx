import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Network from '../utils/Network';
import Token from '../components/Token';
import TokenMonitorForm from '../components/TokenMonitorForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import { ContainerTable } from '../utils/styles';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { logout } from '../utils/web3-utils';

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
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState({
    address: '',
    chainId: 0,
  });

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
    } catch (error: any) {
      if (error.response.status === 401) {
        logout();
      }
      console.error('Token monitor error:', error);
    }
  };

  useEffect(() => {
    fetchTokenMonitorSettings();
  }, []); // Llamada inicial

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

      fetchTokenMonitorSettings();
      toast.success('Token monitor successfully deleted');

    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      console.error('There was an error deleting the token monitor:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  return (
    <TokenMonitorSection>
      <h2>Token Monitor Settings:</h2>
      <TokenMonitorForm onSuccess={fetchTokenMonitorSettings} />
      {tokenMonitorSettings ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Address</th>
                <th>Chain ID</th>
                <th>Tokens</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tokenMonitorSettings.map((setting, index) => (
                <tr key={index}>
                  <td>{setting.address}</td>
                  <td>
                    <Network network={setting.chainId} width={1200} />
                  </td>
                  <td>
                    {setting?.tokens?.length > 0 &&
                      setting?.tokens.map((item, index) => (
                        <Token key={index} token={item} chain={setting.chainId} />
                      ))}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(setting.address, setting.chainId)
                      }
                      src={deleteIcon}
                      alt="Eliminar"
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

const TokenMonitorSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 874px;
`;

export default TokenMonitorSettings;

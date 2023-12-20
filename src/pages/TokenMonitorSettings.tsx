import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Network from '../utils/Network';
import Token from '../components/Token';
import TokenMonitorForm from '../components/TokenMonitorForm';
import Modal from 'react-modal';
import deleteIcon from '../assets/delete.png';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    } catch (error) {
      console.error('Token monitor error:', error);
    }
  };

  useEffect(() => {
    fetchTokenMonitorSettings();
  }, []); // Llamada inicial

  const handleDeleteClick = (address: string, chainId: number) => {
    setDeleteParams({ address, chainId });
    setIsModalOpen(true);
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
      console.log('Token monitor eliminado con éxito');

      // Llamada a fetchTokenMonitorSettings después de una eliminación exitosa
      fetchTokenMonitorSettings();
    } catch (error) {
      console.error('Error al eliminar el token monitor:', error);
    }

    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };


  return (
    <TokenMonitorSection>
      <h2>Token Monitor Settings:</h2>
      <TokenMonitorForm />
      {tokenMonitorSettings ? (
        <>
          {' '}
          <Table>
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
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={handleCancelDelete}
                      contentLabel="Confirmar eliminación"
                      style={{
                        overlay: {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        content: {
                          width: '50%',
                          height: '100px',
                          margin: 'auto',
                          background: 'black',
                          border: 0,
                          textAlign: 'center',
                        },
                      }}
                    >
                      <h2>¿Estás seguro que deseas eliminar este token?</h2>
                      <button onClick={handleConfirmDelete}>Sí</button>
                      <button onClick={handleCancelDelete}>No</button>
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>{' '}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </TokenMonitorSection>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
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

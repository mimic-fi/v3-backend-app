import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TokenListForm from '../components/TokenListForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface TokenListSetting {
  isActive: boolean;
  lastUpdate: string;
  name: string;
  updatedAt: string;
  url: string;
  _id: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const TokenListSettings: React.FC = () => {
  const [
    tokenRegistrySettings,
    setTokenListSettings,
  ] = useState<TokenListSetting[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchTokenListSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<TokenListSetting[]>(
        `${URL}/token-registry/lists`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setTokenListSettings(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchTokenListSettings();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchTokenListSettings();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteParams(id);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/token-registry/lists/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchTokenListSettings();
      toast.success('Token list item successfully deleted');

    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error deleting the token list item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };


  return (
    <TokenListSection>
      <TokenListForm onSuccess={fetchTokenListSettings} />
      {tokenRegistrySettings ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Active</th>
                <th>Last Update</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tokenRegistrySettings.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {item.url}
                  </td>
                  <td>
                    {item.isActive ? 'yes' : 'x'}
                  </td>
                  <td>
                    {moment(item.lastUpdate).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>
                  <img
                    onClick={() =>
                      handleDeleteClick(item._id)
                    }
                    src={deleteIcon}
                    alt="Eliminar"
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>
          {customModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this token list item?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </TokenListSection>
  );
};

const TokenListSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

export default TokenListSettings;

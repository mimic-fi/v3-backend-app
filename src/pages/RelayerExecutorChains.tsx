import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import DeniedChainsForm from '../components/DeniedChainsForm';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, Section } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface DeniedChainsSetting {
  chainId: number
}

const RelayerExecutorChains: React.FC = () => {
  const [
    deniedChainsSettings,
    setDeniedChainsSettings,
  ] = useState<DeniedChainsSetting[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchDeniedChainsSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<DeniedChainsSetting[]>(
        `${URL}/relayer-executor/denied-chains`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setDeniedChainsSettings(response.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      console.error('Denied chains error:', error);
    }
  };

  useEffect(() => {
    fetchDeniedChainsSettings();
  }, []);

  const handleDeleteClick = (chainId: string) => {
    setDeleteParams(chainId);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const chainId = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/denied-chains/${chainId}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchDeniedChainsSettings();
      toast.success('Denied chain item successfully deleted');
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      console.error('There was an error deleting the denied chain item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  return (
    <Section>
      <h2>Denied Chains:</h2>
      <DeniedChainsForm onSuccess={fetchDeniedChainsSettings}/>
      {deniedChainsSettings ? (
        <>
        {deniedChainsSettings.length > 0 ?
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deniedChainsSettings.map((item, index) => (
                <tr key={index}>
                  <td>{item.chainId}</td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(item.chainId.toString())
                      }
                      src={deleteIcon}
                      alt="Eliminar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable> :  'There are no denied chains yet'}
          {customModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this denied chain item?"
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



export default RelayerExecutorChains;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import DeniedSmartVaultsForm from '../components/DeniedSmartVaultsForm';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, Section } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface DeniedSmartVaults{
  chainId: number,
  address: string,
  _id: any,
  comment?: string,
}

const RelayerExecutorSmartVaults: React.FC = () => {
  const [
    deniedSmartVaults,
    setDeniedSmartVaults,
  ] = useState<DeniedSmartVaults[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchDeniedSmartVaults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<DeniedSmartVaults[]>(
        `${URL}/relayer-executor/denied-smart-vaults`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setDeniedSmartVaults(response.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      console.error('Denied chains error:', error);
    }
  };

  useEffect(() => {
    fetchDeniedSmartVaults();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteParams(id);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/denied-smart-vaults/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchDeniedSmartVaults();
      toast.success('Denied chain item successfully deleted');
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
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
      <h2>Denied Smart Vaults:</h2>
      <DeniedSmartVaultsForm onSuccess={fetchDeniedSmartVaults}/>
      {deniedSmartVaults ? (
        <>
        {deniedSmartVaults.length > 0 ?
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th>Address</th>
                <th>Comment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deniedSmartVaults.map((item, index) => (
                <tr key={index}>
                  <td>{item.chainId}</td>
                  <td>{item.address}</td>
                  <td>{item.comment}</td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(item._id.toString())
                      }
                      src={deleteIcon}
                      alt="Eliminar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable> :  'There are no denied smart vaults yet'}
          {customModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this task from the denied list?"
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

export default RelayerExecutorSmartVaults;

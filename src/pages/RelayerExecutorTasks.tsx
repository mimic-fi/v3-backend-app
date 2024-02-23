import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import DeniedTasksForm from '../components/DeniedTasksForm';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, Section } from '../utils/styles';
import { refresh } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface DeniedTasks{
  chainId: number,
  address: string,
  _id: any,
  comment?: string,
}

const RelayerExecutorTasks: React.FC = () => {
  const [
    deniedTasks,
    setDeniedTasks,
  ] = useState<DeniedTasks[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchDeniedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<DeniedTasks[]>(
        `${URL}/relayer-executor/denied-tasks`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setDeniedTasks(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchDeniedTasks();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Denied chains error:', error);
    }
  };

  useEffect(() => {
    fetchDeniedTasks();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteParams(id);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/denied-tasks/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchDeniedTasks();
      toast.success('Denied chain successfully deleted');
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
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
      <DeniedTasksForm onSuccess={fetchDeniedTasks}/>
      {deniedTasks ? (
        <>
        {deniedTasks.length > 0 ?
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
              {deniedTasks.map((item, index) => (
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
                      alt="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable> :  'There are no denied tasks yet'}
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

export default RelayerExecutorTasks;

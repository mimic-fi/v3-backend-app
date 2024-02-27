import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import NetworkThresholdForm from '../components/NetworkThresholdForm';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import Network from '../utils/Network';
import { ContainerTable, Section } from '../utils/styles';
import { refresh } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface Threshold {
  chainId: number,
  amount: number,
  _id: string,
}

const NetworkThresholds: React.FC = () => {
  const [
    thresholdData,
    setThresholdData,
  ] = useState<Threshold[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchThresholds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Threshold[]>(
        `${URL}/relayer-executor/thresholds`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setThresholdData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchThresholds();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Thresholds error:', error);
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  const handleDeleteClick = (chainId: string) => {
    setDeleteParams(chainId);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/thresholds/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchThresholds();
      toast.success('Threshold successfully deleted');
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error deleting the threshold item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  return (
    <Section>
      <NetworkThresholdForm onSuccess={fetchThresholds}/>
      {thresholdData ? (
        <>
        {thresholdData.length > 0 ?
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {thresholdData.map((item, index) => (
                <tr key={index}>
                  <td><Network network={item.chainId} width={1200} /></td>
                  <td>{item.amount}</td>
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



export default NetworkThresholds;

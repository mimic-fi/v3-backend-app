import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import TransactionDelayForm from '../components/TransactionDelayForm';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import Network from "../utils/Network";
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface TDelay {
  chainId: number;
  createdAt: string;
  seconds: number;
  updatedAt: string;
  _id: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const TransactionDelays: React.FC = () => {
  const [
    data,
    setData,
  ] = useState<TDelay[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<TDelay[]>(
        `${URL}/relayer-executor/transaction-delays`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      console.log(response.data)

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
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteParams(id);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/transaction-delays/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchData();
      toast.success('Token list successfully deleted');

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
    <Section>
      <TransactionDelayForm onSuccess={fetchData} />
      {data ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Seconds</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td><Network network={item.chainId} width={1200} /></td>
                  <td>
                    {moment(item.createdAt).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>
                    {moment(item.updatedAt).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>{item.seconds}</td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(item._id)
                      }
                      src={deleteIcon}
                      alt="Delete"
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

export default TransactionDelays;

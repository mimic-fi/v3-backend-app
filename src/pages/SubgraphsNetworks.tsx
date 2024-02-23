import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import SubgraphsNetworksForm from '../components/SubgraphsNetworksForm';
import deleteIcon from '../assets/delete.png';
import Network from '../utils/Network';
import { toast } from 'react-toastify';
import { ContainerTable, Section } from '../utils/styles';
import { refresh } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface SubgraphsNetworks{
  chainId: number,
  url: string,
  _id: any,
  comment?: string,
}

const RelayerExecutorSubgraphs: React.FC = () => {
  const [
    subgraphs,
    setSubgraphsNetworks,
  ] = useState<SubgraphsNetworks[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchSubgraphsNetworks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<SubgraphsNetworks[]>(
        `${URL}/relayer-executor/subgraph-networks`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setSubgraphsNetworks(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchSubgraphsNetworks();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Subgraphs networks error:', error);
    }
  };

  useEffect(() => {
    fetchSubgraphsNetworks();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteParams(id);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/relayer-executor/subgraph-networks/${id}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      fetchSubgraphsNetworks();
      toast.success('Subgraph network was successfully deleted');
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error deleting the subgraph item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  return (
    <Section>
      <SubgraphsNetworksForm onSuccess={fetchSubgraphsNetworks}/>
      {subgraphs ? (
        <>
        {subgraphs.length > 0 ?
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th>URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subgraphs.map((item, index) => (
                <tr key={index}>
                  <td><Network network={item.chainId} width={1200} /></td>
                  <td>{item.url}</td>
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

export default RelayerExecutorSubgraphs;

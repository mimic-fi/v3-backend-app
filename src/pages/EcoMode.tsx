import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import EcoModeForm from '../components/EcoModeForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import Network from "../utils/Network";
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface EcoMode {
  active: boolean;
  safeGuardPeriodPct: number;
  averageSuccessSpeedSmoothFactor: number;
  maximumExecutionsPerPeriod: number;
  _id: string;
  updatedAt: string;
  smartVault: {
   address: string;
   chainId: number;
 };
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const EcoModes: React.FC = () => {
  const [
    ecoModesData,
    setEcoModes,
  ] = useState<EcoMode[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<EcoMode | null>(null);

  const fetchEcoModes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<EcoMode[]>(
        `${URL}/relayer-executor/eco-modes`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setEcoModes(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchEcoModes();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchEcoModes();
  }, []);

  const handleDeleteClick = (item: EcoMode) => {
    setDeleteParams(item);
    setCustomModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if(deleteParams) {
      const url = `${URL}/relayer-executor/eco-modes/${deleteParams.smartVault.chainId}/${deleteParams.smartVault.address}`;

      try {
        await axios.delete(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        });
        fetchEcoModes();
        toast.success('Eco mode successfully deleted');

      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            await refresh();
            await handleConfirmDelete();
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        }
        console.error('There was an error deleting this eco mode item:', error);
      }
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };


  return (
    <EcoModeSection>
      <EcoModeForm onSuccess={fetchEcoModes} />
      {ecoModesData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Smart Vault</th>
                <th>Network</th>
                <th>Active</th>
                <th>Success Speed Smooth Factor</th>
                <th>Safe Guard Period Pct</th>
                <th>Max Executions Per Period</th>
                <th>Last Update</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ecoModesData.map((item, index) => (
                <tr key={index}>
                  <td>{item.smartVault.address}</td>
                  <td><Network network={item.smartVault.chainId} width={1200} /></td>
                  <td>
                    {item.active ? '🟢' : '🔴'}
                  </td>
                  <td>
                    {item.averageSuccessSpeedSmoothFactor}
                  </td>
                  <td>{item.safeGuardPeriodPct}</td>
                  <td>{item.maximumExecutionsPerPeriod}</td>
                  <td>
                    {moment(item.updatedAt).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>
                    <img
                      onClick={() =>
                        handleDeleteClick(item)
                      }
                      src={deleteIcon}
                      alt="Delete"
                    />
                  </td>
                  <td>
                    view timelock
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
    </EcoModeSection>
  );
};

const EcoModeSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

export default EcoModes;

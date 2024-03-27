import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import EcoModeForm from '../components/EcoModeForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, TableDetails, BackButton } from '../utils/styles';
import Network from "../utils/Network";
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface Timelock {
  name: string;
  task: string;
  end: string;
  start: string;
  timelock: {
    allowedAt: string;
    frequency: string;
    mode: string;
    window: string;
  }
}

interface EcoMode {
  active: boolean;
  safeGuardPeriodPct: number;
  averageSuccessSpeedSmoothFactor: number;
  maximumExecutionsPerPeriod: number;
  gasPriceMedianThreshold: number;
  isolatedTasksAvoidanceList: [string];
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
  const [timelock, setTimelock] = useState<EcoMode | null>(null);
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
    if (deleteParams) {
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
      {timelock ? <><BackButton onClick={() => setTimelock(null)}>🔙</BackButton><Timelocks item={timelock} /></> :
        <>
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
                    <th>Gas Price Median Threshold</th>
                    <th>Isolated Tasks Avoidance List</th>
                    <th>Last Update</th>
                    <th>Timelocks</th>
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
                      <td>{item.gasPriceMedianThreshold}</td>
                      <td>{item.isolatedTasksAvoidanceList &&
                        item.isolatedTasksAvoidanceList.map((task, index) => (
                          <React.Fragment key={index}>
                            {task}
                            {index !== item.isolatedTasksAvoidanceList.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </td>
                      <td>
                        {moment(item.updatedAt).format('MMMM DD, YYYY [at] HH:mm:ss')}
                      </td>
                      <td>
                        <TableDetails onClick={() => setTimelock(item)}>Timelocks</TableDetails>
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
        </>}
    </EcoModeSection>
  );
};


const Timelocks: React.FC<{ item: EcoMode; }> = ({ item }) => {
  const [
    timelocks,
    setTimelocks,
  ] = useState<Timelock[] | null>(null);

  const fetchTimelocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Timelock[]>(
        `${URL}/relayer-executor/eco-modes/${item.smartVault.chainId}/${item.smartVault.address}/timelocks`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setTimelocks(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchTimelocks();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchTimelocks();
  }, []);

  return (
    <>{timelocks &&
      <ContainerTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Task</th>
            <th>Allowed At</th>
            <th>Frequency</th>
            <th>Mode</th>
            <th>Window</th>
          </tr>
        </thead>
        <tbody>
          {timelocks.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{new Date(item.start).toLocaleString('es-ES', {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </td>
              <td>{new Date(item.end).toLocaleString('es-ES', {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </td>
              <td>{item.task}</td>
              <td>{item.timelock.allowedAt}</td>
              <td>{item.timelock.frequency}</td>
              <td>{item.timelock.mode}</td>
              <td>{item.timelock.window}</td>
            </tr>
          ))}
        </tbody>
      </ContainerTable>}
    </>
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

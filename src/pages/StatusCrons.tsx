import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface Status {
  suspend: boolean;
  schedule: string;
  name: string;
  lastScheduleTime: string;
  nextScheduleTime: string;
  _id: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const StatusRelayer: React.FC = () => {
  const [
    statusRelayerData,
    setData,
  ] = useState<Status[] | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Status[]>(
        `${URL}/jobs/status`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
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
      console.error('There was an error loading the data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = statusRelayerData ? statusRelayerData.filter(obj => !obj.name.startsWith("relayer-executor-cron")) : null;


  return (
    <Section>
      {statusRelayerData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Schedule</th>
                <th>Next Schedule Time</th>
                <th>Last Schedule Time</th>
                <th>Suspended</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {item.schedule}
                  </td>
                  <td>
                    {moment(item.nextScheduleTime).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>
                    {moment(item.lastScheduleTime).format('MMMM DD, YYYY [at] HH:mm:ss')}
                  </td>
                  <td>
                    {item.suspend ? '🚨' : '🟢'}
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>
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

export default StatusRelayer;

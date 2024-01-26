import React, { ReactNode, useEffect, useState } from 'react';
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
  lastCompletionTime: any;
  lastStartTime: any;
  lastScheduleTime: any;
  nextScheduleTime: any;
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
      console.error('There was an error loading the data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = statusRelayerData ? statusRelayerData.filter(obj => obj.name.startsWith("relayer-executor-cron")) : null;

  const formatDuration = (duration:any) => {
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let formattedDuration = '';
    if (hours > 0) {
      formattedDuration += `${hours} h${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      formattedDuration += ` ${minutes} min`;
    }
    if (seconds > 0) {
      formattedDuration += ` ${seconds} sec`;
    }

    return formattedDuration.trim();  // Elimina espacios al final
  };
  return (
    <Section>
      {statusRelayerData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Last Completion Time</th>
                <th>Last Start Time</th>
                <th>Schedule</th>
                <th>Next Schedule Time</th>
                <th>Last Schedule Time</th>
                <th>Suspended</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>
                    {moment(item.lastCompletionTime).format('DD/MM/YY HH:mm[hs]')}
                  </td>
                  <td>
                    {moment(item.lastStartTime).format('DD/MM/YY HH:mm[hs]')}
                  </td>
                  <td>
                    {item.schedule}
                  </td>
                  <td>
                    {moment(item.nextScheduleTime).format('DD/MM/YY HH:mm[hs]')}
                  </td>
                  <td>
                    {moment(item.lastScheduleTime).format('DD/MM/YY HH:mm[hs]')}
                  </td>
                  <td>
                    {item.suspend ? '🚨' : '🟢'}
                  </td>
                  <td>
                    {formatDuration(moment.duration(moment(item.lastCompletionTime).diff(moment(item.lastStartTime))))}
                    {moment.duration(moment(item.lastCompletionTime).diff(moment(item.lastStartTime))).asMinutes() < 2 ? (
                        <> 🚨</>
                      ) : ''
                    }
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

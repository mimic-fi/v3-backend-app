import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
import { ContainerTable } from '../utils/styles';
import Network from "../utils/Network";
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface LogGroups {
  creationTime: number;
  arn: string;
  firstEventTimestamp: number;
  lastEventTimestamp: number;
  lastIngestionTime: number;
  logStreamName: string;
  uploadSequenceToken: string;
  storedBytes: number
}
interface Data {
  logStreams: LogGroups[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const LogsStreams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = window.location.href.split("/groups?name=")
  const [
    ecoModesData,
    setLogsStreams,
  ] = useState<LogGroups[] | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get<Data>(
        `${URL}/logs/streams`,
        {
          params: {
            logGroupName: name[1]
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setLogsStreams(response.data?.logStreams);
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

  const handleRowClick = (id: string) => {
     navigate(`${location.pathname.split('logs/groups')[0]}logs/${id}/groups?name=${name[1]}`, {
       replace: true,
     });
   };

  return (
    <EcoModeSection>
      {ecoModesData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {ecoModesData.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item.logStreamName)}>
                  <td>{item.logStreamName}</td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>
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
  td {
    cursor: pointer;
  }
`;

export default LogsStreams;

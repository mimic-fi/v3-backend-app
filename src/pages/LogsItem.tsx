import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';
import { ContainerTable } from '../utils/styles';
import Network from "../utils/Network";
import moment from 'moment';
import { refresh } from '../utils/web3-utils';

interface Logs {
  ingestionTime: number;
  timestamp: number;
  message: string;
}
interface Data {
  events: Logs[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const LogsStreams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const id = params.id
  const name = window.location.href.split("/groups?name=")[1]
  const [
    ecoModesData,
    setLogsStreams,
  ] = useState<Logs[] | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get<Data>(
        `${URL}/logs/streams/${id}`,
        {
          params: {
            logGroupName: name
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );
      setLogsStreams(response.data?.events);
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

  return (
    <EcoModeSection>
      {ecoModesData ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Ingestion Time</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {ecoModesData.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{new Date(item.ingestionTime).toLocaleString()}</td>
                  <td>{item.message}</td>
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

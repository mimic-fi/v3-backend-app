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
  logGroupClass: string;
  logGroupName: string;
  metricFilterCount: number
}
interface Data {
  logGroups: LogGroups[];
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const LogsStreams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [
    ecoModesData,
    setLogsStreams,
  ] = useState<LogGroups[] | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Data>(
        `${URL}/logs/groups`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setLogsStreams(response.data?.logGroups);
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

  const handleRowClick = (logGroupName: string) => {
     navigate(`${location.pathname}/groups?name=${logGroupName}`, {
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
                <th>Arn</th>
                <th>Created at</th>
                <th>Class</th>
                <th>Metric filter Count</th>
              </tr>
            </thead>
            <tbody>
              {ecoModesData.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item.logGroupName)}>
                  <td>{item.logGroupName}</td>
                  <td>{item.arn}</td>
                  <td>{new Date(item.creationTime).toLocaleString()}</td>
                  <td>{item.logGroupClass}</td>
                  <td>{item.metricFilterCount}</td>
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

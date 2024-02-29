import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import Switch from './Switch';
import { toast } from 'react-toastify';
import moment from 'moment';
import { refresh } from '../utils/web3-utils';
import { ButtonViolet } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface EcoModeFormProps {
  onSuccess?: () => void;
}

const EcoModeForm: React.FC<EcoModeFormProps> = ({ onSuccess = () => { } }) => {
  const [smartVault, setSmartVault] = useState('');
  const [chainId, seChainId] = useState('');
  const [guardPeriod, setGuardPeriod] = useState('');
  const [smoothFactor, seSmoothFactor] = useState('');
  const [executions, setExecutions] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const lastUpdate = moment().toISOString();
      const isActive = true;
      const response = await axios.post(
        `${URL}/relayer-executor/eco-modes/${chainId}/${smartVault}`,
        {
          active: isActive,
          safeGuardPeriodPct: parseFloat(guardPeriod),
          averageSuccessSpeedSmoothFactor: parseFloat(smoothFactor),
          maximumExecutionsPerPeriod: parseFloat(executions),
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setMessage(`The token has been successfully created`);

      onSuccess();

      toast.success('Token creado con éxito');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          try {
            await refresh();
            await handleFormSubmit(e);
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        }
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage(`Error: An unexpected error occurred`);
      }
    }
  };

  return (
    <Form bg={bg} onSubmit={handleFormSubmit}>
      {message !== '' ? (
        <Message>
          <span>{message}</span>
          <span className="close" onClick={() => setMessage('')}>
            X
          </span>
        </Message>
      ) : (
          <>
            <Group>
              <div>
                <label>Smart Vault</label>
                <input
                  type="text"
                  value={smartVault}
                  onChange={(e) => setSmartVault(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Chain Id</label>
                <input
                  type="number"
                  value={chainId}
                  onChange={(e) => seChainId(e.target.value)}
                  required
                />
              </div>
            </Group>
            <Group>
              <div>
                <label>Safe Guard Period Pct</label>
                <input
                  type="number"
                  value={guardPeriod}
                  onChange={(e) => setGuardPeriod(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Average Success Speed Smooth Factor</label>
                <input
                  type="number"
                  value={smoothFactor}
                  onChange={(e) => seSmoothFactor(e.target.value)}
                  required
                />
              </div>
            </Group>
            <Group>
              <div>
                <label>Maximum Executions Per Period</label>
                <input
                  type="number"
                  value={executions}
                  onChange={(e) => setExecutions(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Active</label>
                <Switch
                  ison={isActive}
                  onToggle={() => setIsActive(!isActive)}
                />
              </div>
            </Group>
            <ButtonViolet type="submit">New</ButtonViolet>
          </>
        )}
    </Form>
  );
};

interface FormProps {
  bg: string;
}

const Form = styled.form<FormProps>`
  width: 874px;
  margin-top: 50px;
  gap: 30px;
  background-size: cover;
  background: url(${(props) => props.bg}) no-repeat 10%;
  padding: 10px 20px;
  border-radius: 20px;
  background-size: cover;
  height: auto;
  button {
    height: 46px;
    margin-top: 10px;
  }
`;

const Group = styled.div`
  display: flex;
  gap: 30px;
`;

const Message = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  .close {
    cursor: pointer;
    font-weight: bold;
  }
`;

export default EcoModeForm;

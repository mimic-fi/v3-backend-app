import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import { refresh } from '../utils/web3-utils';
import { ButtonViolet } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface NetworkThresholdFormProps {
  onSuccess?: () => void;
}

const NetworkThresholdForm: React.FC<NetworkThresholdFormProps> = ({  onSuccess = () => {} }) => {
  const [chainId, setChainId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${URL}/relayer-executor/thresholds`,
        {
          chainId,
          amount
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setMessage(`The network threshold was succesfully created`);
      onSuccess();
    } catch (error: any) {
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
          <div>
            <label>Chain id</label>
            <input
              type="number"
              value={chainId}
              onChange={(e) => setChainId(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
          </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  background-size: cover;
  background: url(${(props) => props.bg}) no-repeat 10%;
  padding: 10px 20px;
  border-radius: 20px;
  background-size: cover;
  height: 115px;
  button {
    height: 46px;
    margin-top: 10px;
  }
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

export default NetworkThresholdForm;

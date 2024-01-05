import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import { toast } from 'react-toastify';
import { logout } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface Web3FormProps {
  onSuccess?: () => void;
}

const Web3Form: React.FC<Web3FormProps> = ({ onSuccess = () => {} }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    chainId: '',
    nativeTokenSymbol: '',
    rpcQueryEndpoints: [],
    rpcExecutionEndpoints: [],
  });
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const { chainId, ...rest } = formValues;
      const response = await axios.post(
        `${URL}/web3/networks`,
        {
          chainId: parseInt(chainId, 10),
          ...rest,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setMessage(`New item has been successfully created`);
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage(`Error: An unexpected error occurred`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'rpcQueryEndpoints' || name === 'rpcExecutionEndpoints') {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value.split(',').map((item) => item.trim()),
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
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
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Chain ID:</label>
              <input
                type="number"
                name="chainId"
                value={formValues.chainId}
                onChange={handleInputChange}
                required
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Native Token Symbol:</label>
              <input
                type="text"
                name="nativeTokenSymbol"
                value={formValues.nativeTokenSymbol}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>RPC Query Endpoints (comma-separated):</label>
              <input
                type="text"
                name="rpcQueryEndpoints"
                value={formValues.rpcQueryEndpoints?.join(',')}
                onChange={handleInputChange}
                required
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>RPC Execution Endpoints (comma-separated):</label>
              <input
                type="text"
                name="rpcExecutionEndpoints"
                value={formValues.rpcExecutionEndpoints?.join(',')}
                onChange={handleInputChange}
                required
              />
            </div>
          </Group>
          <button type="submit">New</button>
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

export default Web3Form;

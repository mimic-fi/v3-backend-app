import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import { toast } from 'react-toastify';
import { refresh } from '../utils/web3-utils';
import { ButtonViolet } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface Web3FormProps {
  onSuccess?: () => void;
}

const Web3Form: React.FC<Web3FormProps> = ({ onSuccess = () => {} }) => {
  const [formValues, setFormValues] = useState({
    chainId: '',
    seconds: '',
  });
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const { chainId, seconds } = formValues;
      const response = await axios.post(
        `${URL}/relayer-executor/transaction-delays`,
        {
          chainId: parseInt(chainId, 10),
          seconds: parseInt(seconds, 10),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
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
              <label>Chain ID</label>
              <input
                type="number"
                name="chainId"
                value={formValues.chainId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Seconds</label>
              <input
                type="number"
                name="seconds"
                value={formValues.seconds}
                onChange={handleInputChange}
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
  background-size: cover;
  width: 874px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
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

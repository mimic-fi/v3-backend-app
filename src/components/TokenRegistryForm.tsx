import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import Switch from './Switch';
import { logout } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface TokenListFormProps {
  onSuccess?: () => void;
}

interface TokenFormData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  isNativeToken: boolean;
  isWrappedNativeToken: boolean;
  incompatibleTasks: string[];
  [key: string]: string | number | boolean | string[];
}

const TokenListForm: React.FC<TokenListFormProps> = ({ onSuccess = () => {} }) => {
  const [formData, setFormData] = useState<TokenFormData>({
    address: '',
    symbol: '',
    name: '',
    decimals: 0,
    chainId: 0,
    isNativeToken: false,
    isWrappedNativeToken: false,
    incompatibleTasks: [],
  });

  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${URL}/token-registry/tokens`,
        {
          ...formData,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setMessage(`New token registry item has been successfully created`);

      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          logout();
        }
        setMessage(`Error: ${error.response?.data?.content?.message}`);
      } else {
        setMessage(`Error: An unexpected error occurred`);
      }
    }
  };

  const handleSwitchToggle = (field: keyof TokenFormData) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddresses = e.target.value;
    const addressesArray = inputAddresses.split(',').map((address) => address.trim());

    setFormData((prevData) => ({
      ...prevData,
      incompatibleTasks: addressesArray,
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
          <Group>
            <div>
              <label>Address:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Symbol:</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Decimals:</label>
              <input
                type="number"
                value={formData.decimals}
                onChange={(e) =>
                  setFormData({ ...formData, decimals: parseInt(e.target.value, 10) })
                }
                required
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Chain ID:</label>
              <input
                type="number"
                value={formData.chainId}
                onChange={(e) => setFormData({ ...formData, chainId: parseInt(e.target.value, 10) })}
                required
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Is Native Token:</label>
              <Switch
                ison={formData.isNativeToken}
                onToggle={() => handleSwitchToggle('isNativeToken')}
              />
            </div>
            <div>
              <label>Is Wrapped Native Token:</label>
              <Switch
                ison={formData.isWrappedNativeToken}
                onToggle={() => handleSwitchToggle('isWrappedNativeToken')}
              />
            </div>
          </Group>
          <Group>
            <div>
              <label>Incompatible Addresses (comma-separated):</label>
              <input
                type="text"
                placeholder="Enter addresses separated by commas"
                value={formData.incompatibleTasks.join(', ')}
                onChange={handleAddressInputChange}
              />
            </div>
          </Group>
          <Button type="submit">New</Button>
        </>
      )}
    </Form>
  );
};

const Group = styled.div`
  display: flex;
  gap: 30px;
`;

const Button = styled.button`
  height: 46px;
  margin-top: 10px;
`;

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

export default TokenListForm;

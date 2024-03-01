import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bg from '../assets/bg.png';
import { refresh } from '../utils/web3-utils';
import { Tab, ButtonWhite, ButtonViolet } from '../utils/styles';
import PriceOraclePrices from './PriceOraclePrices'

const URL = process.env.REACT_APP_SERVER_BASE_URL;


function Tabs() {
  const [activeTab, setActiveTab] = useState('settings');


  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('settings')}
          className={activeTab === 'settings' ? 'active' : ''}
        >
          Settings
        </button>
        <button
          onClick={() => handleTabClick('prices')}
          className={activeTab === 'prices' ? 'active' : ''}
        >
          Prices
        </button>
      </Tab>
      <div>
        {activeTab === 'settings' && <PriceOracleSettings />}
        {activeTab === 'prices' && <PriceOraclePrices /> }
      </div>
    </div>
  );
}
interface PriceOracleSettingsProps {
  onSuccess?: () => void;
}

interface RelayerData {
  _id: string
  rateLimitRequests: number
  rateLimitWindowMs: number
  corsAllowedOrigins: string[]
}

const PriceOracleSettings: React.FC<PriceOracleSettingsProps> = ({ onSuccess = () => {} }) => {
  const [message, setMessage] = useState('')
  const [priceOracleData, setPriceOracleData] = useState<RelayerData | null>(null)
  const [editedSettings, setEditedSettings] = useState<Partial<
    RelayerData
  > | null>(null)


  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL}/price-oracle/settings`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        })
        setPriceOracleData(response.data)
        setEditedSettings(response.data)

      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            await refresh();
            await fetchApiSettings();
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        }
        console.error('There was an error with relayer executor form data:', error)
      }
    }

    fetchApiSettings()
  }, [])

  const handleCancelEditClick = () => {
    setEditedSettings(priceOracleData)
  }

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${URL}/price-oracle/settings`, editedSettings, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
          'x-auth-token': `${token}`,
        },
      }).then(response => {
        setMessage(`The form has been successfully updated`)
      })
      .catch(error => {
        setMessage(`There was an error`)
      });
    } catch (error) {
      console.error('Error al guardar las configuraciones de la API:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedSettings((prevSettings: any) => {
      const updatedValue = e.target.type === 'number' ? parseFloat(value) : value;

      return {
        ...prevSettings,
        [name]: updatedValue,
      };
    });
  };

  return (
    <Form bg={bg} onSubmit={handleSaveClick}>
      {message !== '' ? (
        <Message>
          <span>{message}</span>
          <span className="close" onClick={() => setMessage('')}>
            X
          </span>
        </Message>
      ) : (
        <>
        <div className="container">
        {editedSettings &&
          Object.entries(editedSettings as RelayerData).map(([key, value]) => (
            key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && (
              <div key={key} className="input-group">
                <label>{key}</label>
                <input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  name={key}
                  value={typeof value === 'number' ? value : String(value)}
                  onChange={handleInputChange}
                  disabled={key === '_id'}
                />
              </div>
            )
          ))
        }
        </div>
        <div className="buttons">
          <ButtonViolet type="submit">Guardar</ButtonViolet>
          <ButtonWhite onClick={handleCancelEditClick}>
            Cancelar
          </ButtonWhite>
        </div>
        </>
      )}
    </Form>
  );
};

interface FormProps {
  bg: string;
}

const Form = styled.form<FormProps>`
  width: 1050px;
  margin: 50px auto 0 auto;
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
    margin-right: 20px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .input-group {
    width: calc(33.33% - 10px);
    margin-right: 10px;
    margin-bottom: 10px;
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

export default Tabs;

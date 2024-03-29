import React, { useEffect, useState } from 'react'
import UserList from '../components/UserList'
import axios from 'axios'
import styled from 'styled-components'
import bg from '../assets/bg.png'
import { refresh } from '../utils/web3-utils';
import { Tab, ButtonViolet, ButtonWhite } from '../utils/styles';

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
          onClick={() => handleTabClick('users')}
          className={activeTab === 'users' ? 'active' : ''}
        >
          Users
        </button>
      </Tab>
      <div>
        {activeTab === 'settings' && <ApiSettings />}
        {activeTab === 'users' && <UserList /> }
      </div>
    </div>
  );
}

interface ApiSetting {
  _id: string
  rateLimitRequests: number
  rateLimitWindowMs: number
  corsAllowedOrigins: string
}

const URL = process.env.REACT_APP_SERVER_BASE_URL

const ApiSettings: React.FC = () => {
  const [apiSettings, setApiSettings] = useState<ApiSetting | null>(null)
  const [message, setMessage] = useState('');
  const [editedSettings, setEditedSettings] = useState<Partial<
    ApiSetting
  > | null>(null)

  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL}/api/settings`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        })
        setApiSettings(response.data)
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
        console.error('Error al obtener las configuraciones de la API:', error)
      }
    }

    fetchApiSettings()
  }, [])

  const handleCancelEditClick = () => {
    setEditedSettings(apiSettings)
  }

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const apiData = {
        ...editedSettings,
        corsAllowedOrigins: editedSettings?.corsAllowedOrigins?.split(',')
      };
      await axios.put(`${URL}/api/settings`, apiData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
          'x-auth-token': `${token}`,
        },
      }).then(response => {
        setMessage(`The API form was succesfully updated`);
      })
      .catch(error => {
        localStorage.setItem('put', error.toString())
      });

    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleSaveClick(e);
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Error al guardar las configuraciones de la API:', error)
      debugger;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedSettings((prevSettings: any) => ({
      ...prevSettings,
      [name]: value,
    }))
  }

  return (
    <ApiSection>
      {apiSettings ? (
        <>
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
                  {Object.entries(editedSettings as ApiSetting).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label>{key}</label>
                        <input
                          type="text"
                          name={key}
                          value={String(value)}
                          onChange={handleInputChange}
                          disabled={key === '_id' || key === 'updatedAt'}
                        />
                      </div>
                    )
                  )}
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
        </>
      ) : (
        <p>Loading configurations...</p>
      )}
    </ApiSection>
  )
}
interface FormProps {
  bg: string
}

const Form = styled.form<FormProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #3d404f;
  border-radius: 20px;
  margin: 50px auto 0 auto;
  gap: 30px;
  background: url(${(props) => props.bg}) no-repeat 10%;
  padding: 10px 20px;
  background-size: cover;
  .container {
    display: grid;
    grid-template-columns: 320px 320px;
    grid-gap: 30px;
  }
  .buttons {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    width: 670px;
  }

  button {
    margin-right: 20px;
  }
`

const ApiSection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 874px;
`

const Message = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  .close {
    cursor: pointer;
    font-weight: bold;
  }
`

export default Tabs

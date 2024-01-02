import React, { useEffect, useState } from 'react'
import UserList from '../components/UserList'
import axios from 'axios'
import styled from 'styled-components'
import bg from '../assets/bg.png'

interface ApiSetting {
  _id: string
  rateLimitRequests: number
  rateLimitWindowMs: number
  corsAllowedOrigins: string[]
}

const URL = process.env.REACT_APP_SERVER_BASE_URL

const ApiSettings: React.FC = () => {
  const [apiSettings, setApiSettings] = useState<ApiSetting | null>(null)
  const [editedSettings, setEditedSettings] = useState<Partial<
    ApiSetting
  > | null>(null)

  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL}/api-setting`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        })
        setApiSettings(response.data)
        setEditedSettings(response.data)
      } catch (error: any) {
        if (error.response.status === 401) {
          localStorage.removeItem('token');
        }
        console.error('Error al obtener las configuraciones de la API:', error)
      }
    }

    fetchApiSettings()
  }, [])

  const handleCancelEditClick = () => {
    setEditedSettings(apiSettings)
  }

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${URL}/api-setting`, editedSettings, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
          'x-auth-token': `${token}`,
        },
      }).then(response => {
        localStorage.setItem('put', response.toString())
      })
      .catch(error => {
        alert('error del put: ' + error)
        localStorage.setItem('put', error.toString())
      });


    } catch (error: any) {
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
      <h2>API Settings:</h2>
      {apiSettings ? (
        <>
          <Form bg={bg}>
            <div className="container">
              {Object.entries(editedSettings as ApiSetting).map(
                ([key, value]) => (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      name={key}
                      value={String(value)}
                      onChange={handleInputChange}
                    />
                  </div>
                )
              )}
            </div>
            <div className="buttons">
              <button onClick={handleSaveClick}>Guardar</button>
              <button className="white" onClick={handleCancelEditClick}>
                Cancelar
              </button>
            </div>
          </Form>
        </>
      ) : (
        <p>Loading configurations...</p>
      )}

      <UserList />
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
  padding: 40px 20px;
  border-radius: 20px;
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

export default ApiSettings

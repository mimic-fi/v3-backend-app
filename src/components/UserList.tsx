import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SignUpForm from './SignUpForm'
import styled from 'styled-components'
import { logout } from '../utils/web3-utils';
import { ContainerTable, Section } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL

interface User {
  _id: number;
  email: string;
  lastUpdate: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${URL}/users`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        })
        setUsers(response.data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            logout();
          }
          console.error('Error al obtener la lista de usuarios:', error)
        } else {
          console.error('Error al obtener la lista de usuarios:', error)
        }
      }
    }

    fetchUsers()
  }, [])

  return (
    <Section>
      <h2>Users:</h2>
      <SignUpForm/>
      {users && users?.length > 0 ? (
        <ContainerTable>
          <thead>
            <tr>
              <th>User</th>
              <th>Last update</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}:</td>
              <td>Last update:{' '}
                {new Date(user.lastUpdate).toLocaleDateString('en-US', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
                 hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 timeZoneName: 'short',
               })}
             </td>
            </tr>
          ))}
          </tbody>
        </ContainerTable>
        ) : (
          <p>Loading users...</p>
        )}
    </Section>
  )
}

export default UserList

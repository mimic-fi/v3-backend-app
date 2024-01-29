import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SignUpForm from './SignUpForm'
import styled from 'styled-components'
import { refresh } from '../utils/web3-utils';
import { ContainerTable, Section } from '../utils/styles';

const URL = process.env.REACT_APP_SERVER_BASE_URL

interface User {
  _id: number;
  email: string;
  updatedAt: string;
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
            try {
              await refresh();
              await fetchUsers();
            } catch (refreshError) {
              console.error(`Error: Unable to refresh token. Please log in again.`);
            }
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
      <SignUpForm/>
      {users && users?.length > 0 ? (
        <ContainerTable>
          <thead>
            <tr>
              <th>User</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
                 hour: 'numeric',
                 minute: 'numeric',
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

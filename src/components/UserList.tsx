import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SignUpForm from './SignUpForm'
import styled from 'styled-components'

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
        console.error('Error al obtener la lista de usuarios:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h2>Users:</h2>
      <SignUpForm/>

      {users && users?.length > 0 ? (
          <Container>
            {users.map((user) => (
              <List key={user._id}>
                <Name>{user.email}:</Name>
                <span>Last update:{' '}
                  {new Date(user.lastUpdate).toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric',
                   hour: 'numeric',
                   minute: 'numeric',
                   second: 'numeric',
                   timeZoneName: 'short',
                 })}
               </span>
              </List>
            ))}
          </Container>
        ) : (
          <p>Loading users...</p>
        )}
    </div>
  )
}

const List = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 10px 30px;
  border-bottom: solid 1px grey;
  span {
    font-size: 15px;
  }
`

const Name = styled.p`
font-size: 20px;
letter-spacing: 0.3px;

`

const Container = styled.div`
  margin: 50px auto;
`

export default UserList

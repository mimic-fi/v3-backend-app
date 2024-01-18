import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const bg: string = require('../assets/bg.png')
const logo: string = require('../assets/mimic-admin.svg').default

const URL = process.env.REACT_APP_SERVER_BASE_URL

interface LoginFormProps {
  onLogin: () => void
  showError: (message: string) => void
}

export default function Login({ onLogin, showError }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${URL}/login`, { email, password })
      localStorage.setItem('token', response.data.accessToken)
      onLogin()
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        showError(error.response.data?.content?.message || error.response.data)
      } else {
        showError('Something went wrong :(')
      }
    }
  }

  return (
    <>
      <Navbar />
      <LoginSection>
        <Form onSubmit={handleSubmit} background={bg}>
          <TitleM>Log in</TitleM>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          <ButtonColor type="submit">Login</ButtonColor>
        </Form>
      </LoginSection>
    </>
  )
}

const LoginSection = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
`

interface FormProps {
  background: string
}

const Form = styled.form<FormProps>`
  display: block;
  background-size: cover;
  background: url(${props => props.background}) no-repeat 10%;
  padding: 40px 200px;
  border-radius: 20px;
  background-size: cover;
  input {
    display: block;
    margin-bottom: 20px;
    width: 300px;
    height: 40px;
    padding: 0 10px;
    border-radius: 7px;
    border: 0px;
    font-family: 'DMSans';
    font-size: 15px;
  }
`

const ButtonColor = styled.button`
  display: inline-block;
  width: auto;
  padding: 10px 24px;
  border-radius: 16px;
  border: 0px;
  background: #6f5ce6;
  font-family: 'DMSans';
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  cursor: pointer;
  color: #ffffff;
  margin-top: 20px;
  &:hover {
    background: #582ea0;
  }
`

const TitleM = styled.h1`
  color: white;
  font-size: 24px;
  margin: 0;
  font-family: 'Visby';
  font-style: normal;
  line-height: 120%;
  font-size: 40px;
  margin-bottom: 50px;
  @media only screen and (max-width: 800px) {
    font-size: 32px;
  }
`

export function Navbar() {
  return (
    <NavbarSection>
      <NavbarContainer>
        <img alt="logo" src={logo} />

        <NavbarLink>
          Learn more in{' '}
          <a target="_blank" href="https://mimic.fi" rel="noreferrer">
            Mimic.fi
          </a>
        </NavbarLink>
      </NavbarContainer>
    </NavbarSection>
  )
}

const NavbarSection = styled.section`
  z-index: 100;
  width: 100%;
  margin: auto;
  position: sticky;
  background: #12141a;
`

const NavbarContainer = styled.div`
  margin: 0 32px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding 0;
`

const NavbarLink = styled.div`
  color: #a5a1b7;
  font-feature-settings: 'clig' off, 'liga' off;
  a {
    font-weight: 700;
    color: #6f5ce6;
    font-family: 'DMSansBold';
  }
`

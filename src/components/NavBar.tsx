import { Link } from 'react-router-dom'
import styled from 'styled-components'

const logo: string = require('../assets/mimic-admin.svg').default

interface NavBarProps {
  onLogout: () => void
}

export default function NavBar({ onLogout }: NavBarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    onLogout()
  }

  return (
    <NavbarSection>
      <NavbarContainer>
        <img alt="logo" src={logo} />
        <div className="nav-bar">
          <Link to="/dashboard/api">API</Link>
          <Link to="/dashboard/price-oracle">Price Oracle</Link>
          <Link to="/dashboard/relayer-executor">Relayer Executor</Link>
          <Link to="/dashboard/token-monitor">Token Monitor</Link>
          <Link to="/dashboard/token-registry">Token Registry</Link>
          <Link to="/dashboard/web3">Web3</Link>
        </div>
        <NavbarLink>
          <ButtonColor onClick={handleLogout}>Logout</ButtonColor>
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

   a {
     padding: 0 15px;
     color: white;
     text-decoration: none;
     font-weight: bold;
   }
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
  &:hover {
    background: #582ea0;
  }
`

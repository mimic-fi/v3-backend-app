import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../utils/web3-utils';

const logo: string = require('../assets/mimic-admin.svg').default;

interface NavBarProps {
  onLogout: () => void;
}

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const isActive = window.location.pathname.includes(to);

  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`}>
      <NavLink to={to} className="nav-link">
        {label}
      </NavLink>
    </div>
  );
};

export default function NavBar({ onLogout }: NavBarProps) {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <NavbarSection>
      <NavbarContainer>
        <img alt="logo" src={logo} />
        <div className="nav-bar">
          <NavItem to="/dashboard/status" label="Status" />
          <NavItem to="/dashboard/environments" label="Environments" />
          <NavItem to="/dashboard/api" label="API" />
          <NavItem to="/dashboard/price-oracle" label="Price Oracle" />
          <NavItem to="/dashboard/relayer-executor/settings" label="Relayer Executor" />
          <NavItem to="/dashboard/token-monitor" label="Token Monitor" />
          <NavItem to="/dashboard/token-registry" label="Token Registry" />
          <NavItem to="/dashboard/web3" label="Web3" />
        </div>
        <NavbarLink>
          <ButtonColor onClick={handleLogout}>Logout</ButtonColor>
        </NavbarLink>
      </NavbarContainer>
    </NavbarSection>
  );
}

const NavbarSection = styled.section`
  z-index: 100;
  width: 100%;
  margin: auto;
  position: sticky;
  background: #12141a;

  .nav-item.active {
    .nav-link {
      color: #6f5ce6;
    }
    border-bottom: 2px solid #6f5ce6;
    padding-bottom: 7px;
  }
  .nav-item {
    display: inline;
    margin: 0 10px;
    font-weight: bold;
  }
`;

const NavbarContainer = styled.div`
  margin: 0 32px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
`;

const NavbarLink = styled.div`
  color: #a5a1b7;
  font-feature-settings: 'clig' off, 'liga' off;

  a {
    font-weight: 700;
    color: #6f5ce6;
    font-family: 'DMSansBold';
  }
`;

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
`;

export { NavItem };

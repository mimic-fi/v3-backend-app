import React, { useState } from 'react';
import styled from 'styled-components';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const StyledSwitch = styled.div<{ isOn: boolean }>`
  width: 60px;
  height: 30px;
  background-color: ${({ isOn }) => (isOn ? '#6f5ce6' : '#ccc')}; 
  border-radius: 15px;
  position: relative;
  cursor: pointer;
`;

const SwitchHandle = styled.div<{ isOn: boolean }>`
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  transition: transform 0.3s ease;
  transform: ${({ isOn }) => (isOn ? 'translateX(30px)' : 'translateX(0)')};
`;

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle }) => {
  return (
    <StyledSwitch isOn={isOn} onClick={onToggle}>
      <SwitchHandle isOn={isOn} />
    </StyledSwitch>
  );
};

export default Switch;

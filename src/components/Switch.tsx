import React, { useState } from 'react';
import styled from 'styled-components';

interface SwitchProps {
  ison: boolean;
  onToggle: () => void;
}

const StyledSwitch = styled.div<{ ison: string }>`
  width: 60px;
  height: 30px;
  background-color: ${({ ison }) => (ison === 'true' ? '#6f5ce6' : '#ccc')};
  border-radius: 15px;
  position: relative;
  cursor: pointer;
`;

const SwitchHandle = styled.div<{ ison: string }>`
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  transition: transform 0.3s ease;
  transform: ${({ ison }) => (ison === 'true' ? 'translateX(30px)' : 'translateX(0)')};
`;

const Switch: React.FC<SwitchProps> = ({ ison, onToggle }) => {
  return (
    <StyledSwitch ison={ison.toString()} onClick={onToggle}>
      <SwitchHandle ison={ison.toString()} />
    </StyledSwitch>
  );
};

export default Switch;

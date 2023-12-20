import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CHAIN_INFO } from '../constants/chainInfo';

interface NetworkProps {
  network: any;
  width: number;
  small?: boolean;
  noLogo?: boolean;
}

const Network: React.FC<NetworkProps> = ({
  network,
  small = undefined,
  noLogo = false,
}) => {
  const [totalWidth, setTotalWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setTotalWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const selectedChain: any = CHAIN_INFO[network || ''];
  const medium = 700;

  if (selectedChain) {
    return (
      <NetworkSection>
        {!noLogo && (
          <ChainLogo src={selectedChain?.logoUrl} alt={`${selectedChain?.name} Logo`} />
        )}
        {!small && (!totalWidth || totalWidth >= medium) && selectedChain?.name}
      </NetworkSection>
    );
  }

  return <>{network ? network : ''}</>;
};

const NetworkSection = styled.div`
  display: flex;
  align-items: center;
`;

const ChainLogo = styled.img`
  width: 25px;
  object-fit: scale-down;
  margin-right: 10px;
`;

export default Network;

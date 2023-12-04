import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Asegúrate de importar la constante directamente si no necesitas la interfaz ChainInfo
import { CHAIN_INFO } from '../../constants/chainInfo';

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

  // Usamos 'any' para selectedChain
  const selectedChain: any = CHAIN_INFO[network || ''];

  const medium = 700;

  if (selectedChain) {
    return (
      <Net>
        {!noLogo && (
          <ChainLogo src={selectedChain?.logoUrl} alt={`${selectedChain?.name} Logo`} />
        )}
        {!small && (!totalWidth || totalWidth >= medium) && selectedChain?.name}
      </Net>
    );
  }

  return <>{network ? network : ''}</>;
};

const Net = styled.div`
  display: flex;
  align-items: center;
`;

const ChainLogo = styled.img`
  width: 25px;
  object-fit: scale-down;
  margin-right: 10px;
`;

export default Network;

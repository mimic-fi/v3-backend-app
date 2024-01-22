// Componente.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getEtherscanLink, shortenAddress } from '../utils/web3-utils';
import copyImg from '../assets/copy.png';
import ok from '../assets/check.png';
import open from '../assets/link.png';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { SingleNameBlockies } from './Blockies';

interface AddressProps {
  address: string;
  chainId?: any;
  showIdentity?: boolean;
  short?: boolean;
  withLink?: boolean;
  type?: 'address' | 'transaction';
}

const Address: React.FC<AddressProps> = ({
  address,
  chainId = '1',
  showIdentity = true,
  short = false,
  type = 'address',
  withLink= true,
}) => {
  const [copy, setCopy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const [totalWidth, setTotalWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setTotalWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const pleaseCopy = () => {
    if (setCopy && typeof setCopy === 'function') {
      setCopy(address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
  };

  return (
    <Container>
      {showIdentity && <SingleNameBlockies imageSize={20} address={address} />}
      <TextAddress
        href={getEtherscanLink(chainId, address, type === 'transaction' ? 'transaction' : 'address')}
        target="_blank"
        rel="noreferrer"
      >
        {totalWidth < 700 || short ? shortenAddress(address) : address}
      </TextAddress>
      {copied ? (
        <ImgSm src={ok} />
      ) : (
        <ImgSm src={copyImg} onClick={() => pleaseCopy()} />
      )}
      {withLink &&
        <a
          href={getEtherscanLink(chainId, address, type === 'transaction' ? 'transaction' : 'address')}
          target="_blank"
          rel="noreferrer"
        >
          <ImgSm src={open} />
        </a>
      }
    </Container>
  );
};

const ImgSm = styled.img`
  height: 15px !important;
  width: 15px !important;
  padding: 0px !important;
  margin: 0px 5px;
  margin-top: 1px;
`;

const Container = styled.div`
  display: inline-flex;
  cursor: pointer;
`;

const TextAddress = styled.a`
  &:hover {
    transition: 0.15s ease color;
    color: ${(props) => props.theme.complementaryRoyalPurple};
  }
`;

export default Address;

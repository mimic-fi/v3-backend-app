import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getEtherscanLink } from '../utils/web3-utils'
import deleteIcon from '../assets/delete.png'

interface TokenInfo {
  data?: {
    decimals: number;
    symbol: string;
  };
  isLoading: boolean;
}

interface TokenSectionProps {
  token: string;
  chain: any;
}

const TokenSection: React.FC<TokenSectionProps> = ({ token, chain }) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ isLoading: true });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.mimic.fi/public/tokens/${chain}/${token}`;
        const response = await axios.get(url);
        setTokenInfo({ data: response.data, isLoading: false });
      } catch (error) {
        console.error('Error fetching token info:', error);
        setTokenInfo({ isLoading: false });
      }
    };

    fetchData();
  }, [token, chain]);

  return (
    <div>
      {!tokenInfo.isLoading && (
        <>
          <a href={getEtherscanLink(chain, token, 'address')}
          target="_blank"
          rel="noreferrer">
            {tokenInfo?.data?.symbol}
          </a>
        </>
      )}
    </div>
  );
};

export default TokenSection;

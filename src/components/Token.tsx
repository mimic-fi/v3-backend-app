import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getEtherscanLink } from '../utils/web3-utils';

const URL = process.env.REACT_APP_SERVER_BASE_URL;

interface TokenInfo {
  data?: TokensInfo;
  isLoading: boolean;
}

interface TokenSectionProps {
  tokens: any;
  chain: any;
}

interface TokensInfo {
  [key: string]: {
    _id?: string;
    address?: string;
    chainId?: number;
    decimals?: number;
    isNativeToken?: boolean;
    isERC20?: boolean;
    isWrappedNativeToken?: boolean;
    name?: string;
    symbol?: string;
  };
}

const TokenSection: React.FC<TokenSectionProps> = ({ tokens, chain }) => {
  const token = localStorage.getItem('token');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ isLoading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tokens.length > 0) {
          const chunkSize = 200;
          let mergedData: TokensInfo = {};

          for (let i = 0; i < tokens.length; i += chunkSize) {
            const chunk = tokens.slice(i, i + chunkSize);

            const response = await axios.get<{ data: TokensInfo; pages: number; total: number }>(
              `${URL}/token-registry/tokens`,
              {
                params: {
                  limit: 200,
                  page: 1,
                  addresses: chunk,
                },
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-type': 'application/json',
                  'x-auth-token': `${token}`,
                },
              }
            );

            mergedData = { ...mergedData, ...response.data?.data };
          }

          setTokenInfo({ data: mergedData, isLoading: false });
        } else {
          setTokenInfo({ data: {}, isLoading: false });
        }
      } catch (error) {
        console.error('Error fetching token info:', error);
        setTokenInfo({ isLoading: false });
      }
    };

    fetchData();
  }, [token, chain, tokens]);

  return (
    <>
      {!tokenInfo.isLoading &&
        tokenInfo.data &&
        Object.values(tokenInfo.data).map((item, index) => (
          <React.Fragment key={index}>
            <a
              href={getEtherscanLink(chain, item?.address || '', 'address')}
              target="_blank"
              rel="noreferrer"
            >
              {item?.symbol}
            </a>
            {index !== tokens.length - 1 && ', '}
          </React.Fragment>
        ))}
    </>
  );
};

export default TokenSection;

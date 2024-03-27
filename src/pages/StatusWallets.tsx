// @ts-nocheck
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable } from '../utils/styles';
import Network from '../utils/Network';
import moment from 'moment';
import { refresh } from '../utils/web3-utils';
import { formatTokenAmount } from '../utils/math-utils';

interface Costs {
  [index: number]: {
    chainId: number;
    averageCost?: number;
  };
}

interface Status {
  transactions?: {
    id: number;
    date: string;
  };
  nonces?: {
    [key: string]: {
      onChain: number;
      local: number;
    };
  };
  costs?: Costs | null;
}



interface NoncesData {
  [key: number ]: {
    onChain: number;
    local: number;
  };
}

interface Balances {
  [key: string]: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const NoncesTable: React.FC<{ name: string; nonceData: NoncesData; balances: Balances | null; costs: Costs | null | undefined}> = ({ name, nonceData, balances, costs }) => {
  console.log(costs)
  return (
    <div>
      <h2>{name}</h2>
      <ContainerTable>
        <thead>
          <tr>
            <th>Chain</th>
            <th>On Chain</th>
            <th>Local</th>
            <th>Balances</th>
            <th>Balance USD</th>
            <th>Average Tx Cost</th>
            <th>Remaining Txs</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries<any>(nonceData).map(([key, value], index) => {
            let cost = ''
            if (costs && typeof costs === 'object') { 
              const keyNumber = parseInt(key);
              cost = Object.values(costs).find(item => item.chainId === keyNumber);
            }
            return(
            <tr key={index}>
              <td><Network network={key} width={1200} /></td>
              <td>{value.onChain}</td>
              <td className={value.local > value.onChain ? "red" : ""}>{value.local}</td>
              <td>{(balances && key in balances) ? formatTokenAmount(balances[key], 18, {digits: 2}) : ''}</td>

                <PriceUsd
                  address="0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                  chainId={key}
                  balance={(balances && key in balances) ? parseFloat(formatTokenAmount(balances[key], 18, { digits: 7 }) || '') : 0}
                  cost={cost}
                />


            </tr>


          )})}
        </tbody>
      </ContainerTable>
    </div>
  );
};


const StatusRelayer: React.FC = () => {
  const [
    statusData,
    setData,
  ] = useState<Status | null>(null);
  const [
    balances,
    setBalances,
  ] = useState<{ [key: string]: Balances }>({});
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<string>('');



  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Status>(
        `${URL}/relayer-executor/transactions/report`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchData();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error loading the data:', error);
    }
  };

  const fetchBalances = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ [key: string]: Balances }>(
        `${URL}/web3/wallets/balances`,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setBalances(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchBalances();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error loading the data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBalances();
  }, []);


  return (
    <Section>
      {statusData ? (
        <>{statusData.nonces && Object.entries(statusData.nonces).map(([key, value]) => (
        <NoncesTable name={key} nonceData={value} balances={(balances && key in balances) ? balances[key] : null} costs={statusData?.costs} />
      ))}</>
      ) : (
        <p>Loading...</p>
      )}
    </Section>
  );
};


interface PriceProps {
  address: string;
  chainId?: any;
  balance: any;
  cost: any;
}

interface Data {
  address: string;
  chainId: string;
  price: number;
}

const PriceUsd: React.FC<PriceProps> = ({
  address = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  chainId = '1',
  balance,
  cost
}) => {
  const [
    data,
    setData,
  ] = useState<Data[] | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${URL}/price-oracle/prices/last`,
        { params: {
            addresses: [address],
            chainId,
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      )
      setData(response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response?.status === 401) {
          try {
            await refresh();
            await fetchData();
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        } else {
          console.error(`Error: ${error.response.data.message}`)
        }
      } else {
        console.error(`Error: An unexpected error occurred`)
      }
    }
  }
  let highlighted = false
  let balanceUSD = 0
  if(data && (Object.values(data).find(item => item.chainId === cost.chainId)?.price)) {
    balanceUSD = data ? ((Object.values(data).find(item => item.chainId === cost.chainId)?.price) * balance) : 0;
    if(cost && cost.averageCost && (parseFloat((cost.averageCost*20)).toFixed(2) > parseFloat(balanceUSD.toFixed(2)))) {
      highlighted = true
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <td>
      {data && (
          <>
            {data.map((item, index) => (
              <span className={highlighted ? 'highlighted' : ''}>${' '}{balance ? (item.price * balance).toFixed(2) : ''}</span>
            ))}
          </>
      )}
    </td>
    <td>$ {cost?.averageCost?.toFixed(2)}</td>
    <td>{cost?.averageCost ?
      <span className={balanceUSD/cost?.averageCost < 20 ? 'highlighted' : '' }>
      {(balanceUSD/cost?.averageCost).toFixed(2)}</span> : '-'}
    </td>
    </>
  )
}


const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
  .highlighted {
    color: red;
  }
`;

export default StatusRelayer;

import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import bg from '../assets/bg.png'
import refreshIcon from '../assets/refresh.png';
import { ContainerTable, Section, ButtonViolet } from '../utils/styles';
import Network from '../utils/Network';
import Token from '../components/Token';
import { refresh } from '../utils/web3-utils';


const URL = process.env.REACT_APP_SERVER_BASE_URL

interface Data {
  address: string;
  chainId: string;
  price: number;
}

const PricesSearch: React.FC = () => {
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [
    data,
    setData,
  ] = useState<Data[] | null>(null);
  const [
    refreshParams,
    setRefreshParams,
  ] = useState<Data | null>(null);
  const [message, setMessage] = useState('')


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${URL}/price-oracle/prices/last`,
        {
          params: {
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
            await handleFormSubmit(e);
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        } else {
          setMessage(`Error: ${error.response.data.message}`)
        }
      } else {
        setMessage(`Error: An unexpected error occurred`)
      }
    }
  }

  const handleRefreshClick = (item: Data) => {
    setRefreshParams(item);
    setLoading(true);
    handleRefresh();
  };

  const handleRefresh = async () => {

    try {
      if(refreshParams) {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${URL}/price-oracle/prices/${refreshParams.chainId}/${refreshParams.address}`,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
              'x-auth-token': `${token}`,
            },
          }
        )
        setLoading(false)
        setData([response.data])
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response?.status === 401) {
          try {
            await refresh();
            handleRefresh();
          } catch (refreshError) {
            console.error(`Error: Unable to refresh token. Please log in again.`);
          }
        } else {
          setMessage(`Error: ${error.response.data.message}`)
        }
      } else {
        setMessage(`Error: An unexpected error occurred`)
      }
    }

  };

  return (
    <Section>
      <Form bg={bg} onSubmit={handleFormSubmit}>
        {message !== '' ? (
          <Message>
            <span>{message}</span>
            <span className="close" onClick={() => setMessage('')}>
              X
            </span>
          </Message>
        ) : (
            <>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>ChainId</label>
                <input
                  type="text"
                  value={chainId}
                  onChange={e => setChainId(e.target.value)}
                  required
                />
              </div>
              <ButtonViolet type="submit">Search</ButtonViolet>
            </>
          )}
      </Form>
      {data && (
        <ContainerTable>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Token Address</th>
              <th>Chain</th>
              <th>Price</th>
              <th>Refresh</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td><Token tokens={[item?.address]} chain={item.chainId} /></td>
                <td>{item.address}</td>
                <td>
                  <Network network={item.chainId} width={1200} />
                </td>
                <td>
                  {item.price}
                </td>
                <td>
                  {isLoading ? '...' : <img
                    onClick={() =>
                      handleRefreshClick(item)
                    }
                    src={refreshIcon}
                    alt="Refresh"
                  />}
                </td>
              </tr>
            ))}
          </tbody>
        </ContainerTable>
      )}
      {!data && isLoading && <div>...Loading</div>}
    </Section>
  )
}

interface FormProps {
  bg: string
}

const Form = styled.form<FormProps>`
  width: 874px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  background-size: cover;
  background: url(${props => props.bg}) no-repeat 10%;
  padding: 10px 20px;
  border-radius: 20px;
  background-size: cover;
  height: 115px;
  button {
    height: 46px;
    margin-top: 10px;
  }
`

const Message = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  .close {
    cursor: pointer;
    font-weight: bold;
  }
`

export default PricesSearch

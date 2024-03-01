// @ts-nocheck

import React from 'react'
import styled from 'styled-components'
import { formatTokenAmount } from '../utils/math-utils'
import useTokenInfo from '../hooks/useTokenInfo'

const LogsDetail = ({ item }) => {
  return (
    <Container>
      <Movements>
        <Movement token={item?.in} chain={item?.chainId} added={true} />
        {item?.out.map((outItem, index) => {
          return (
            <Movement
              key={index}
              token={outItem}
              chain={item?.chainId}
              added={false}
            />
          )
        })}
        <Reason>{item?.status?.reason}</Reason>
      </Movements>
    </Container>
  )
}

const Movements = styled.span`
  word-break: break-all;
  :not(:first-child) {
    margin-left: 5px;
  }
`

const Container = styled.div`
  align-items: center;
  max-width: 300px;
  gap: 5px;
  img {
    height: 20px;
    object-fit: scale-down;
    margin: 0px 5px -4px 4px;
  }
`

const Reason = styled.div`
  align-items: flex-start;
  color: #b76b8d;
`

const Movement = ({ token, chain, added = false }) => {
  const tokenInfo = useTokenInfo(token.token, chain)
  return (
    <Movements>
      {tokenInfo.isLoading === false && (
        <>
          {added === true ? '+' : '-'}
          {formatTokenAmount(token?.amount, tokenInfo?.data?.decimals, {
            digits: 4,
          })}{' '}
          {tokenInfo?.data?.symbol}
        </>
      )}
    </Movements>
  )
}

export default LogsDetail


import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import Decimal from 'decimal.js'


const useSimpleMonitor = (id, page = 1, limit = 50, filter, refetchInterval = 0) => {
  const { data, isLoading, error, isRefetching, isFetched } = useQuery(
    {
      queryKey: ['simpleMonitor', id, page, filter],
      queryFn: () => fetchMonitors(id, limit, page, filter),
      // keepPreviousData: true,
      staleTime: 1000,
      refetchInterval: refetchInterval
    }
  )

   // Use useMemo to memoize the processed data
   const {summary, tokenList}  = useMemo(() => {
    if (data) {
      return calculateTotalBalances( data )
    }
    return { summary: [] }
  }, [data])

  return { summary, data, tokenList, isLoading, error, isRefetching, isFetched }
  
}

function calculateTotalBalances(data) {
  const summary = []
  const tokenList = []

  for (const [tokenAddress, addresses] of Object.entries(data)) {
      let totalBalance = 0
      const source = []

      for (const [address, balance] of Object.entries(addresses)) {
          totalBalance = new Decimal(balance).plus(totalBalance)
          source.push({ address, balance })
      }

      if (!tokenList.includes(tokenAddress)) {
        tokenList.push(tokenAddress)
      }

      summary.push({
          address: tokenAddress,
          balance: totalBalance.toFixed(),
          source
      })
  }

  return {summary, tokenList }
}



const fetchMonitors = async (id, limit, page, filter) => {
  if (!id) return []
  const url = 'https://api.mimic.fi/public/monitors/balances'

 try {

    const params = {
      environment: id,
      limit,
      page,
      ...filter
    }

    const { data } = await axios.get(url, {
      params: { ...params }
    })

    return data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No logs')
      return false
    }
    throw error // Rethrow other errors
  }
}

export default useSimpleMonitor

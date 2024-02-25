

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useTokenPrices = (tokenList, filter, limit = 50, setLoadPage, setTotalPages) => {
  return useQuery(
    {
      queryKey: ['tokenPrices', tokenList?.toString(), filter.chainId],
      queryFn: () => fetchAllPrices(tokenList, filter, limit, setLoadPage, setTotalPages),
      enabled: tokenList?.length > 0,
      keepPreviousData: true,

    }
  )
}

const fetchAllPrices = async (tokenList, filter, limit, setLoadPage, setTotalPages) => {
  let allData = []

  // Function to split the tokenList into chunks of a given size
  const chunkArray = (array, size) => {
    return array.reduce((acc, _, i) =>
      i % size ? acc : [...acc, array.slice(i, i + size)],
      []
    )
  }

  // Split the tokenList into chunks
  const tokenChunks = chunkArray(tokenList, limit)

  setTotalPages(tokenChunks?.length)
  for (let i = 0; i < tokenChunks?.length; i++) {
    const chunk = tokenChunks[i]

    try {
      const  data  = await fetchPrices(chunk, filter, limit)
      setLoadPage(i + 1)
      if (data) {

      allData = allData.concat(data) // Assuming the API returns an array of data

      }
    } catch (error) {
      console.error('dataTokenPrices Error fetching data for chunk', i, error)
    }
  }

  return allData
}


const fetchPrices = async (tokenList, filter, limit) => {
  if (!tokenList) return []
  const addresses = tokenList || []
  const url = 'https://api.mimic.fi/public/prices/last'
  // https://api.mimic.fi/public/prices?chainId=1&addresses%5B%5D=0xA0b86991c

  try {
    const params = {
      addresses,
      limit,
      chainId: filter.chainId
    }
    const { data } = await axios.get(url, {
      params: { ...params }
    })
    console.log('dataTokenPrices Data2', data)
    return data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No logs')
      return false
    }
    throw error // Rethrow other errors
  }
}

export default useTokenPrices

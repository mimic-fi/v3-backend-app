

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useManyTokenInfo = (tokenList, filter, limit = 50, setLoadPage, setTotalPages) => {
  return useQuery(
    {
    
    queryKey: ['manyTokens', tokenList?.toString(), filter.chainId], 
    queryFn: () => fetchAllTokens(tokenList, filter, limit, setLoadPage, setTotalPages), 
    enabled: tokenList?.length > 0
  }
  )
}

const fetchAllTokens = async (tokenList, filter, limit, setLoadPage, setTotalPages) => {
  let allData = {}

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
      const { data } = await fetchTokenInfo(chunk, filter, limit)
      setLoadPage(i + 1)
      if (data) {
        allData = { ...allData, ...data }
      }
    } catch (error) {
      console.error('Error fetching data for chunk', i, error)
    }
  }

  return allData
}

const fetchTokenInfo = async (tokenList, filter, limit) => {
  if (!tokenList) return []
  const addresses = tokenList || []
  const url = 'https://api.mimic.fi/public/tokens'
  try {

    const params = {
      addresses,
      limit,
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

export default useManyTokenInfo

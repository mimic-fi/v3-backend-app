// @ts-nocheck

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useLogs = (id, page = 1, limit = 50, filter, refetchInterval = 0, enabled = true) => {
  return useQuery(
    {
      queryKey: ['logs', id, page, filter],
      queryFn: () => fetchLogs(id, limit, page, filter),
      // keepPreviousData: true,
      staleTime: 1000,
      refetchInterval: refetchInterval,
      enabled: enabled
    }
  )
}

const fetchLogs = async (id, limit, page, filter) => {
  if (!id) return []
  const url = `https://api.mimic.fi/public/environments/${id}/executions`
 
  try {
    const params = {
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

export default useLogs

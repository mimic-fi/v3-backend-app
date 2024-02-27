import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useTaskData = (id, isOpen) => {
  return useQuery({
    queryKey: ['taskData', id], // data cached with unique id
   queryFn:  () => fetchTokenInfo( id),
    enabled: isOpen
  }
  )
}

const fetchTokenInfo = async (id) => {
  if (!id) return []
  const url = 'https://api.mimic.fi/public/task-executions/' + id +'/transaction'


  try {
    const { data } = await axios.get(url)
    return data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(` ${id} no taskData.`)
      return false 
    }
    throw error // Rethrow other errors
  }
  
}

export default useTaskData



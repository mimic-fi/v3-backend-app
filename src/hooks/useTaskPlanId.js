import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useTaskPlanId = (id, isOpen) => {
  return useQuery({
    queryKey: ['useTaskPlanId', id], // data cached with unique id
    queryFn: () => fetchTokenInfo(id),
    enabled: isOpen
  }
  )
}

const fetchTokenInfo = async (id) => {
  if (!id) return []
  const url = 'https://api.mimic.fi/public/task-executions/' + id + '/plan'

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

export default useTaskPlanId



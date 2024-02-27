import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const useTokenInfo = (address, chainId) => {
    return useQuery({
        queryKey: ['token', chainId, address],
        queryFn: () => fetchTokenInfo(address, chainId)
    }


    )
}

const fetchTokenInfo = async (address, chainId) => {
    if (!address) return []
    const url = 'https://api.mimic.fi/public/tokens/' + chainId + '/' + address


    try {
        const { data } = await axios.get(url)
        return data
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`${chainId}- ${address} no tokenInfo.`)
            return false
        }
        throw error // Rethrow other errors
    }

}


export default useTokenInfo

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface LogFilter {
  [key: string]: any[]; // Replace 'any' with more specific types based on your filter structure
}

interface LogEntry {
    id: string
  // Define the structure of a single log entry based on your API response
}

interface LogsApiResponse {
  data: LogEntry[];
  pages: number,
  limit: number
  // Include other response properties if needed
}
// function usePosts() {
//     return useQuery(["posts"], async (): Promise<Array<Post>> => {
//       const { data } = await axios.get(
//         "https://jsonplaceholder.typicode.com/posts"
//       );
//       return data;
//     });
//   }

const emptyData = {data: [], pages: 0, limit:0}

function useLogs(
    id: string | undefined,
    page: number = 1,
    limit: number = 50,
    filter: LogFilter,
    refetchInterval: number = 0,
    enabled: boolean = true
  ){
    return useQuery<LogsApiResponse, Error>({
        queryKey: ["logs", id, page, filter?.chainIds?.toString()],
        queryFn: async (): Promise<LogsApiResponse> => {
        if (!id) return emptyData;
        console.log('Here we request XOX')
        const url = `https://api.mimic.fi/public/environments/${id}/executions`;
        try {
            const params = { limit, page, ...filter };
            const { data } = await axios.get<LogsApiResponse>(url, { params });
            console.log('useLogs', params)

          return data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            console.log('No logs');
            return emptyData;
          }
          throw error;
        }
      },
    }

    );
  }
  
const fetchLogs = async (
    id: string | undefined,
    limit: number,
    page: number,
    filter: LogFilter
  ): Promise<{ data: LogsApiResponse | [] }> => { // Wrap in an object
    if (!id) return { data: [] };
    const url = `https://api.mimic.fi/public/environments/${id}/executions`;
  
    try {
      const params = { limit, page, ...filter };
      const response = await axios.get<LogsApiResponse>(url, { params });
      return { data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        console.log('No logs');
        return { data: [] };
      }
      throw error;
    }
  };

export default useLogs;

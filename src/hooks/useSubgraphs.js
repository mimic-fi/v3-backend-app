import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';

export const SupportedChainId = {
  MAINNET: 1,
  GOERLI: 5,
  OPTIMISM: 10,
  POLYGON: 137,
  GNOSIS: 100,
  ARBITRUM: 42161,
  MUMBAI: 80001,
  ZKSYNC: 324,
  BSC: 56,
  BASE: 8453,
  AVALANCHE: 43114,
  FANTOM: 250,
  AURORA: 1313161554,
};

export const CHAIN_SUBGRAPH_URL = {
  [SupportedChainId.ARBITRUM]: 'mimic-fi/v3-arbitrum',
  [SupportedChainId.MAINNET]: 'mimic-fi/v3-mainnet',
  [SupportedChainId.POLYGON]: 'mimic-fi/v3-polygon',
  [SupportedChainId.BSC]: 'mimic-fi/v3-bsc',
  [SupportedChainId.AVALANCHE]: 'mimic-fi/v3-avalanche',
  [SupportedChainId.OPTIMISM]: 'mimic-fi/v3-optimism',
  [SupportedChainId.GNOSIS]: 'mimic-fi/v3-gnosis',
  [SupportedChainId.AURORA]: 'mimic-fi/v3-aurora',
  [SupportedChainId.FANTOM]: 'mimic-fi/v3-fantom',
};

const useSubgraphs = id => {
  return useQuery({queryKey: ['useSubgraphs', id], queryFn: () => fetchAllTasks(id)});
};

const fetchSubgraph = async (chainId, id) => {
  try {
    const data = await request(
      'https://api.thegraph.com/index-node/graphql',
      gql`
        query Subgraphs {
          indexingStatusForCurrentVersion(subgraphName: ${'"' + CHAIN_SUBGRAPH_URL[chainId] + '"'}) {
            subgraph
            synced
            fatalError {
              message
            }
            nonFatalErrors {
              message
            }
          }
        }
      `
    );
    return data;
  } catch (error) {
    console.error(`Error fetching subgraph for chain ${chainId}:`, error);
    return null;
  }
};

const fetchAllTasks = async id => {
  const allData = [];
  for (const chainId in CHAIN_SUBGRAPH_URL) {
    const configs = await fetchSubgraph(chainId, id);
    if (configs) {
      allData.push({
          ...configs.indexingStatusForCurrentVersion,
          chainId: chainId
      });
    }
  }
  return allData;
};

export default useSubgraphs;

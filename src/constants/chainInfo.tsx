import ethereumLogoUrl from '../assets/chainLogos/ethereum-logo.svg'
import goerliLogoUrl from '../assets/chainLogos/goerli-logo.svg'
import optimismLogoUrl from '../assets/chainLogos/optimism-logo.svg'
import polygonLogoUrl from '../assets/chainLogos/polygon-logo.svg'
import gnosisLogoUrl from '../assets/chainLogos/gnosis-logo.svg'
import arbitrumLogoUrl from '../assets/chainLogos/arbitrum-logo.svg'
import zksyncLogoUrl from '../assets/chainLogos/zksync.svg'
import bscLogoUrl from '../assets/chainLogos/bsc.svg'
import fantomLogoUrl from '../assets/chainLogos/fantom.svg'
import avalancheLogoUrl from '../assets/chainLogos/avalanche.svg'
import baseLogoUrl from '../assets/chainLogos/base.svg'
import auroraLogoUrl from '../assets/chainLogos/aurora.svg'
import zkevmLogoUrl from '../assets/chainLogos/polygonzkevm.png'

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainInfoType {
  explorer: string;
  name: string;
  logoUrl: string;
  nativeCurrency: NativeCurrency;
  color: string;
  value: number;
  shortName: string;
  rpc?: string;
  isTestnet?: boolean;
  isDisabled?: boolean;
}

export type SupportedChainIdValue = typeof SupportedChainId[keyof typeof SupportedChainId];

export const SupportedChainId = {
  MAINNET: 1,
  // GOERLI: 5,
  OPTIMISM: 10,
  POLYGON: 137,
  GNOSIS: 100,
  ARBITRUM: 42161,
  // MUMBAI: 80001,
  // ZKSYNC: 324,
  ZKEVM: 1101,
  BSC: 56,
  BASE: 8453,
  AVALANCHE: 43114,
  FANTOM: 250,
  AURORA: 1313161554
} as const



export const DEFAULT_CHAIN_ID = SupportedChainId.MAINNET

export const CHAIN_INFO = {
  [SupportedChainId.MAINNET]: {
    explorer: 'https://etherscan.io/',
    name: 'Ethereum',
    logoUrl: ethereumLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    color: '#fff',
    value: SupportedChainId.MAINNET,
    shortName: 'eth',
    rpc: process.env.REACT_APP_MAINNET_RPC_URL || 'https://eth.llamarpc.com',
  },

  // [SupportedChainId.MUMBAI]: {
  //   explorer: 'https://mumbai.polygonscan.com/',
  //   name: 'Mumbai',
  //   logoUrl: polygonLogoUrl,
  //   nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
  //   color: '#de4437',
  //   value: SupportedChainId.MUMBAI,
  //   isTestnet: true,
  //   shortName: 'mumbai',
  // },
  [SupportedChainId.OPTIMISM]: {
    explorer: 'https://optimistic.etherscan.io/',
    name: 'Optimism',
    logoUrl: optimismLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.OPTIMISM,
    shortName: 'opt',
    rpc:
      process.env.REACT_APP_OPTIMISM_RPC_URL ||
      'https://endpoints.omniatech.io/v1/op/mainnet/public',
  },
  [SupportedChainId.POLYGON]: {
    explorer: 'https://polygonscan.com/',
    name: 'Polygon',
    logoUrl: polygonLogoUrl,
    nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.POLYGON,
    shortName: 'matic',
    rpc: process.env.REACT_APP_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  },
  [SupportedChainId.GNOSIS]: {
    explorer: 'https://gnosisscan.io/',
    name: 'Gnosis',
    logoUrl: gnosisLogoUrl,
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.GNOSIS,
    shortName: 'gnosis',
    rpc: process.env.REACT_APP_GNOSIS_RPC_URL || 'https://rpc.gnosischain.com',
  },
  [SupportedChainId.ARBITRUM]: {
    explorer: 'https://arbiscan.io/',
    name: 'Arbitrum',
    logoUrl: arbitrumLogoUrl,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.ARBITRUM,
    shortName: 'arbitrum',
    rpc:
      process.env.REACT_APP_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  },
  // [SupportedChainId.ZKSYNC]: {
  //   explorer: 'https://explorer.zksync.io/',
  //   name: 'zkSync',
  //   logoUrl: zksyncLogoUrl,
  //   shortName: 'zksync',
  //   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  //   color: '#bb437e',
  //   value: SupportedChainId.ZKSYNC,
  //   isDisabled: true,
  // },
  // [SupportedChainId.GOERLI]: {
  //   explorer: 'https://goerli.etherscan.io/',
  //   name: 'Görli',
  //   shortName: 'goerli',
  //   logoUrl: goerliLogoUrl,
  //   nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
  //   color: '#bb437e',
  //   value: SupportedChainId.GOERLI,
  //   isTestnet: true,
  //   rpc:
  //     process.env.REACT_APP_GOERLI_RPC_URL || 'https://rpc.ankr.com/eth_goerli',
  // },
  [SupportedChainId.BSC]: {
    explorer: 'https://bscscan.com/',
    name: 'BNB Smart Chain',
    shortName: 'bnb',
    logoUrl: bscLogoUrl,
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.BSC,
    isTestnet: false,
    rpc:
      process.env.REACT_APP_BNB_RPC_URL ||
      'https://rough-sleek-hill.bsc.quiknode.pro/413cc98cbc776cda8fdf1d0f47003583ff73d9bf',
  },
  [SupportedChainId.FANTOM]: {
    explorer: 'https://ftmscan.com/',
    name: 'Fantom',
    shortName: 'fantom',
    logoUrl: fantomLogoUrl,
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.FANTOM,
    isTestnet: false,
    rpc: process.env.REACT_APP_FANTOM_RPC_URL || 'https://rpc.ankr.com/fantom',
  },
  [SupportedChainId.AVALANCHE]: {
    explorer: 'https://snowtrace.io/',
    name: 'Avalanche',
    shortName: 'avalanche',
    logoUrl: avalancheLogoUrl,
    nativeCurrency: { name: 'Avax', symbol: 'AVAX', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.AVALANCHE,
    isTestnet: false,
    rpc:
      process.env.REACT_APP_AVALANCHE_RPC_URL ||
      'https://rpc.ankr.com/avalanche',
  },
  [SupportedChainId.AURORA]: {
    explorer: 'https://explorer.aurora.dev/',
    name: 'Aurora',
    shortName: 'aurora',
    logoUrl: auroraLogoUrl,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.AURORA,
    isTestnet: false,
    rpc:
      process.env.REACT_APP_AVALANCHE_RPC_URL ||
      'https://mainnet.aurora.dev',
  },
  [SupportedChainId.ZKEVM]: {
    explorer: 'https://zkevm.polygonscan.com/',
    name: 'zkEVM',
    shortName: 'zkevm',
    logoUrl: zkevmLogoUrl,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.ZKEVM,
    isTestnet: false,
    rpc:
      process.env.REACT_APP_AVALANCHE_RPC_URL ||
      'https://zkevm-rpc.com',
  },
  [SupportedChainId.BASE]: {
    explorer: 'https://basescan.org/',
    name: 'Base',
    shortName: 'base',
    logoUrl: baseLogoUrl,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    color: '#bb437e',
    value: SupportedChainId.BASE,
    isTestnet: false,
    rpc:
      process.env.REACT_APP_AVALANCHE_RPC_URL ||
      'https://developer-access-mainnet.base.org',
  },
}

export const CHAIN_SUBGRAPH_URL = {
  [SupportedChainId.ARBITRUM]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-arbitrum',
  [SupportedChainId.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-mainnet',
  [SupportedChainId.POLYGON]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-polygon',
  [SupportedChainId.BSC]:
  'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-bsc',
  [SupportedChainId.AVALANCHE]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-avalanche',
  [SupportedChainId.OPTIMISM]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-optimism',
  [SupportedChainId.ZKEVM]:
     'https://api.studio.thegraph.com/query/58251/mimic-v3-zkevm/version/latest',
  [SupportedChainId.GNOSIS]:
  'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-gnosis',
  [SupportedChainId.AURORA]:
    'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-aurora',
  [SupportedChainId.FANTOM]:
  'https://api.thegraph.com/subgraphs/name/mimic-fi/v3-fantom',
  [SupportedChainId.BASE]:
    'https://api.studio.thegraph.com/query/58251/mimic-v3-base/version/latest',
}

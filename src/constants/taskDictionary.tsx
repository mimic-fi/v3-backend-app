// @ts-nocheck

import inbound from '../assets/logs/Inbound.svg'
import outbound from '../assets/logs/Outbound.svg'
import flow from '../assets/logs/Flow.svg'


export const TasksDictionary = {
  '0xb75336d4fdd496feb8f7e9a1f353bab80683e2e36cdc3451edaa6c4a119eca20': {
    id: 'EXECUTION_TYPE',
  },
  '0xe16b3d8fc79140c62874442c8b523e98592b429e73c0db67686a5b378b29f336': {
    id: 'depositor',
    icon: inbound,

  },
  '0x2705606c9fe826e91a1b8ff6f86de33204c8b1a8bfb55cc430979d7834c66d48': {
    id: 'AXELAR_BRIDGER',
    icon: outbound,
  },
  '0x891a13a970b3919144df6d44edc27e5e09750b1bacff829fbaa31df2350ccf61': {
    id: 'CONNEXT_BRIDGER',
    icon: outbound,
  },
  '0x8b285640c3dd2131bc585f7c897961687bba1403b1402e932745a4a085b2fed1': {
    id: 'HOP_BRIDGER',
    icon: outbound,
  },
  '0x6ee2f653a7d33776e55e4b2dcd8474d17d7af5b57d625d6ff223ec68702c6d52': {
    id: 'WORMHOLE_BRIDGER',
    icon: outbound,
  },
  '0xfdad2f36e879e69005ffdaec159291c5f49a7227dd078e9fa6c6f64abf431bad': {
    id: 'CONVEX_CLAIMER',
    icon: inbound,
  },
  '0x9b3b19993bea1e8cccf265d6d4b7954e4253de1ed727bf20e870acc71538343e': {
    id: 'CONVEX_EXITER',
    icon: inbound,

  },
  '0x5f7645078663a7c7c1a67bf3e57cac3f0823df90abb717e28e9348ba28d9041f': {
    id: 'CONVEX_JOINER',
    icon: outbound,

  },
  '0x56077973770f35aba2180a16b554eeeef58459a8f9f91efada0db23c736effa3': {
    id: 'CURVE_2CRV_EXITER',
    icon: inbound,

  },
  '0x80724c4a6d063239492669e4ad7747d4798ea15423db65fff6fadd70c48a18c0': {
    id: 'CURVE_2CRV_JOINER',
    icon: outbound,

  },
  '0xcbce9983fcd5fc099294db3138f1660107f2bd5b23b9fa0002d7df1db9d854cb': {
    id: 'COLLECTOR',
    icon: inbound,

  },
  '0xca244260aa6b092a9352667c3ad94dc08b2739e94c9a9ac0429c266d77677cda': {
    id: 'UNWRAPPER',
  },
  '0x779b9d7b1cefd23059ce3e2b194efb3183a6685dd830e8cbb723b0cbeb982b28': {
    id: 'WITHDRAWER',
    icon: outbound,
  },
  '0x731c80a84bdec8025a1d25104401907512a73b700acc0418d4085cf0745a9553': {
    id: 'WRAPPER',
  },
  '0x1e074eb2b784a46b7383c748126a8ba7012fdb3d9bab17006b96d93ea6608931': {
    id: 'RELAYER_DEPOSITOR',
    icon: outbound,
  },
  '0xb04abccc9a3bcbe96536610c6bcb56b2f9ec1e9af548139a186f11f31f0e7121': {
    id: 'HOP_L2_SWAPPER',
  },
  '0xb2fb51634eee8eefc9062327c30104c1e44eefaa7b362db57982bcc575abeaf8': {
    id: '1INCH_V5_SWAPPER',
  },
  '0x2aa55357cb8e1cd896f09f21ca5abbf0adf8e40e84efd87c4e402514be3c15ff': {
    id: 'PARASWAP_V5_SWAPPER',
  },
  '0xf256196938420b115ce58753092f939505c868b71e9fe939f29c8b0e81268af6': {
    id: 'UNISWAP_V2_SWAPPER',
  },
  '0x786e6ab94efb5bc7ef1115d1eacf8e0277e0f6954215299c7bb62360d4271aff': {
    id: 'UNISWAP_V3_SWAPPER',
  },
// activity?
  ERC20Claimer: {
    placeholder: '{{amountOut}} {{addressOut}} claimed',
    icon: inbound,
  },
  MetamaskClaimer: {
    placeholder: '{{amountOut}} {{addressOut}} claimed from MM',
    icon: inbound,
  },
  oneInchSwapper: {
    placeholder:
      '{{amountIn}} {{addressIn}} ➡️ {{amountOut}} {{addressOut}} on 1inch',
    icon: flow,
  },
  ParaswapSwapper: {
    placeholder:
      '{{amountIn}} {{addressIn}} ➡️ {{amountOut}} {{addressOut}} on ParaSwap',
    icon: flow,
  },
  ConnextBridger: {
    placeholder: '{{amountIn}} {{addressIn}} bridged to {{networkOut}}',
    icon: outbound,
  },
  Withdrawer: {
    placeholder: '{{amountOut}} {{addressOut}} claimed',
    icon: inbound,
  },
}

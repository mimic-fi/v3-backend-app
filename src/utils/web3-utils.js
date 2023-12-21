import { CHAIN_INFO } from '../constants/chainInfo'

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function convertWeiToGwei(wei) {
  if (!wei) return 0
  const gwei = wei / 1000000000
  return gwei
}

export function getEtherscanLink(chainId, data, type) {
  const prefix = `${CHAIN_INFO[chainId]?.explorer || CHAIN_INFO[1]?.explorer}`

  switch (type) {
    case 'transaction': {
      return `${prefix}tx/${data}`
    }
    case 'address':
    default: {
      return `${prefix}address/${data}`
    }
  }
}



export function isAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false
  }

  return true
}

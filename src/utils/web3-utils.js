import { CHAIN_INFO } from '../constants/chainInfo'
import axios from 'axios'
import JSBI from 'jsbi'

const URL = process.env.REACT_APP_SERVER_BASE_URL
export const NO_BREAK_SPACE = '\u00a0'

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

export function shortenHash(address, charsLength = 4) {
  const prefixLength = 0 // "0x"
  if (!address) {
    return ''
  }

  if (address?.length < charsLength * 2 + prefixLength) {
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
    case 'token': {
      return `${prefix}token/${data}`
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

export function formatNumber(number) {
  if (!number) return 0
  const numAsString = String(number)
  const [integer, decimals] = numAsString?.split('.')

  return [...integer].reverse().reduce((result, digit, index) => {
    return digit + (index > 0 && index % 3 === 0 ? ',' : '') + result
  }, decimals ? `.${decimals}` : '')
}

export function divideRoundBigInt(dividend, divisor) {
  dividend = JSBI.BigInt(String(dividend))
  divisor = JSBI.BigInt(String(divisor))
  return JSBI.divide(
    JSBI.add(dividend, JSBI.divide(divisor, JSBI.BigInt(2))),
    divisor
  ).toString()
}

// export function formatTokenAmount(
//   amount,
//   decimals = 0,
//   { digits = 2, symbol = '', displaySign = false }
// ) {
//   if (!amount) return 0
//   amount = JSBI.BigInt(String(amount))
//   decimals = JSBI.BigInt(String(decimals))
//   digits = JSBI.BigInt(String(digits))

//   const _0 = JSBI.BigInt(0)
//   const _10 = JSBI.BigInt(10)

//   if (JSBI.lessThan(decimals, _0)) {
//     throw new Error('formatTokenAmount(): decimals cannot be negative')
//   }

//   if (JSBI.lessThan(digits, _0)) {
//     throw new Error('formatTokenAmount(): digits cannot be negative')
//   }

//   if (JSBI.lessThan(decimals, digits)) {
//     digits = decimals
//   }

//   const negative = JSBI.lessThan(amount, _0)

//   if (negative) {
//     amount = JSBI.unaryMinus(amount)
//   }

//   const amountConverted = JSBI.equal(decimals, _0)
//     ? amount
//     : JSBI.BigInt(
//         divideRoundBigInt(
//           amount,
//           JSBI.exponentiate(_10, JSBI.subtract(decimals, digits))
//         )
//       )

//   const leftPart = formatNumber(
//     JSBI.divide(amountConverted, JSBI.exponentiate(_10, digits))
//   )

//   const rightPart = String(
//     JSBI.remainder(amountConverted, JSBI.exponentiate(_10, digits))
//   )
//     .padStart(JSBI.toNumber(digits), '0')
//     .replace(/0+$/, '')

//   return [
//     displaySign ? (negative ? '-' : '+') : '',
//     leftPart,
//     rightPart ? `.${rightPart}` : '',
//     symbol ? `${NO_BREAK_SPACE}${symbol}` : '',
//   ].join('')
// }

export function percent(num) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(num)
}

export const refresh = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(
      `${URL}/users/renew-token`,
      {
        refreshToken,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
    localStorage.setItem('token', response.data.accessToken);
  } catch (error) {
    throw new Error('Unable to refresh token');
    logout()
  }
};


export function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}

export function filterByNamespace(objects, searchTerm) {
  const lowerCaseSearchTerm = searchTerm?.toLowerCase();
  
  // Filter the array based on the presence of the search term in the namespace property
  return objects?.filter(obj => 
      obj?.namespace?.toLowerCase()?.includes(lowerCaseSearchTerm)
  );
}
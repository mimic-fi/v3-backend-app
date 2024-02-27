import JSBI from 'jsbi'
import Decimal from 'decimal.js'

export const NO_BREAK_SPACE = '\u00a0'
export const generalFormatPrice = '0.0000'
export const currencyFormatPrice = '0,0.00'

export function formatNumber(number) {
  const numAsString = String(number)
  const [integer, decimals] = numAsString.split('.')

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

// Llamada a toNumber() en formatTokenAmount() y formatNumber()

export function formatTokenAmount(
  amount,
  decimals = 0,
  { digits = 2, symbol = '', displaySign = false }
) {
  if (!amount) return 0
  amount = JSBI.BigInt(String(amount))
  decimals = JSBI.BigInt(String(decimals))
  digits = JSBI.BigInt(String(digits))

  const _0 = JSBI.BigInt(0)
  const _10 = JSBI.BigInt(10)

  if (JSBI.lessThan(decimals, _0)) {
    throw new Error('formatTokenAmount(): decimals cannot be negative')
  }

  if (JSBI.lessThan(digits, _0)) {
    throw new Error('formatTokenAmount(): digits cannot be negative')
  }

  if (JSBI.lessThan(decimals, digits)) {
    digits = decimals
  }

  const negative = JSBI.lessThan(amount, _0)

  if (negative) {
    amount = JSBI.unaryMinus(amount)
  }

  const amountConverted = JSBI.equal(decimals, _0)
    ? amount
    : JSBI.BigInt(
        divideRoundBigInt(
          amount,
          JSBI.exponentiate(_10, JSBI.subtract(decimals, digits))
        )
      )

  const leftPart = formatNumber(
    JSBI.divide(amountConverted, JSBI.exponentiate(_10, digits))
  )

  const rightPart = String(
    JSBI.remainder(amountConverted, JSBI.exponentiate(_10, digits))
  )
    .padStart(digits, '0')
    .replace(/0+$/, '')

  return [
    displaySign ? (negative ? '-' : '+') : '',
    leftPart,
    rightPart ? `.${rightPart}` : '',
    symbol ? `${NO_BREAK_SPACE}${symbol}` : '',
  ].join('')
}

export function percent(num) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(num)
}

export function compact(number) {
  if (number < 1000) {
    return new Intl.NumberFormat('default', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number)
  } else if (number >= 1000 && number < 1_000_000) {
    return (number / 1000).toFixed(1) + 'K'
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    return (number / 1_000_000).toFixed(1) + 'M'
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + 'B'
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return (number / 1_000_000_000_000).toFixed(1) + 'T'
  }
}

export function formatPrice(value, currency = '$') {
  return `${currency}${parseFloat(value).toFixed(2)}`
}

export function formatPrices(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      // You can add more options here to customize the output
  }).format(amount)
}

function formatUnitsDecimals(value, unit = 18) {
  // Convert unit to a Decimal for precision
  let unitValue = new Decimal(10).pow(unit)

  // Convert the value to a Decimal
  let decimalValue = new Decimal(value)

  // Perform the division
  let formattedValue = decimalValue.dividedBy(unitValue)

  // Return the formatted value as a string
  return formattedValue.toString()
}

// magic to get prity numbers for humans
export function formatBNPrice(value = '', decimals = 18) {
  const Dec = Decimal.clone({ precision: 50, defaults: true })
  if (value.toString() === 'NaN') return '0'
  if (!value.toString()) return '0'
  const a = new Dec(value.toString())
  if (!a.isFinite()) return '0'
  const priceDecimal = formatUnitsDecimals(a.toFixed(0), decimals)
  const b = new Dec(priceDecimal)
  // console.log("vaultBalanceAccount ->", value, b.toString(), decimals);
  const price = formatPrices(b.toFixed()).format()
  return price
}

export function formatAmountPrice(value = '', price = 0, decimals = 18) {
  const Dec = Decimal.clone({ precision: 50, defaults: true })
  if (value.toString() === 'NaN') return '0'
  if (!value.toString()) return '0'
  const a = new Dec(value.toString())
  if (!a.isFinite()) return '0'
  const priceDecimal = formatUnitsDecimals(a.toFixed(0), decimals)
  const b = new Dec(priceDecimal).mul(new Dec(price))
  // console.log("vaultBalanceAccount ->", value, b.toString(), decimals);
  const priceResponse = b.toFixed() //formatPriceBis(b.toFixed())
  return priceResponse
}

export function aLessB(b, a){
  if(!a || !b) return 0
  const ab = new Decimal(b).minus(a)
  return parseFloat(ab.toFixed())
}
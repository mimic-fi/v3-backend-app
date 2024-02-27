import { useState, useEffect } from 'react'
import styled from 'styled-components'
// import { PLAYERS } from '../constants/playerAddress'
import { getEtherscanLink, shortenAddress } from '../utils/web3-utils'
import copyImg from '../assets/copy.svg'
import ok from '../assets/ok.svg'
import open from '../assets/open.svg'
import useCopyToClipboard from '../hooks/useCopyToClipboard'
// import { SingleNameBlockies } from './Blockies'

const Address = ({
  address,
  chainId = '1',
  showIdentity = true,
  short = false,
  type = 'address'
}) => {
  // const player = PLAYERS[address]
  // eslint-disable-next-line
  const [copy, setCopy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const [totalWidth, setTotalWidth] = useState(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', () => setTotalWidth(window.innerWidth))
  }, [])

  const pleaseCopy = () => {
    setCopy(address)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  return (
    <Container>
      <TextAddress
        href={getEtherscanLink(chainId, address,  type === 'transaction' ? 'transaction' : 'address')}
        target="_blank"
        rel="noreferrer"
      >
        {totalWidth < 700 || short
          ? shortenAddress(address)
            : address}
      </TextAddress>
      {copied ? (
        <ImgSm src={ok} />
      ) : (
        <ImgSm src={copyImg} onClick={() => pleaseCopy()} />
      )}
      <a
        href={getEtherscanLink(chainId, address, type === 'transaction' ? 'transaction' : 'address')}
        target="_blank"
        rel="noreferrer"
      >
        <ImgSm src={open} />
      </a>
    </Container>
  )
}

const ImgSm = styled.img`
  height: 15px !important;
  width: 15px !important;
  padding: 0px !important;
  margin: 0px 5px;
  margin-top: 1px;
`

const ImgBadge = styled.img`
  height: 12px !important;
  width: 12px !important;
  padding: 0px !important;
`

const BadgeSm = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 100px;
  background-color: ${props => props.backgroundcolor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`

const Container = styled.div`
  display: inline-flex;
  cursor: pointer;
`

const TextAddress = styled.a`
  &:hover {
    transition: 0.15s ease color;
    color: ${props => props.theme.complementaryRoyalPurple};
  }
`

export default Address

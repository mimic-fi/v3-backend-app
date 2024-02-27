import { useState } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '../utils/web3-utils'
import copyImg from '../assets/copy.svg'
import useCopyToClipboard from '../hooks/useCopyToClipboard'

const LongId = ({ longId, chainId = '1' }) => {
  // eslint-disable-next-line
  const [copy, setCopy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)


  const pleaseCopy = () => {
    setCopy(longId)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  return (
    <Container>
      <span>
        {shortenAddress(longId)}
      </span>
      {copied ? (
        <CopyText>ok</CopyText>
      ) : (
        <ImgSm src={copyImg} onClick={() => pleaseCopy()} />
      )}
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

const Container = styled.div`
  display: inline-flex;
  cursor: pointer;
`

const CopyText = styled.div`
  height: 15px !important;
  width: 15px !important;
  padding: 0px !important;
  margin: 0px 5px;
  margin-top: 1px;
  color: ${props => props.theme.complementaryRoyalPurple};
`

export default LongId

import { useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { formatPrice, formatPrices, formatTokenAmount } from '../utils/math-utils'
import useLogs from '../hooks/useLogs'
import { Link } from 'react-router-dom'
import Decimal from 'decimal.js'
import { getEtherscanLink } from '../utils/web3-utils'
import Address from './Address'
import LogsItem from './LogItem'
import Network from '../utils/Network'

const MonitorItem = ({ item, width, colored, environment, selectedOpenAll, selectedThreshold, withThreshold }) => {
  // const large = 1000
  const { symbol, chainId, decimals, balance, address, price, amountUsd, priceUpdated } = item

  const [isOpen, setOpen] = useState(false)
  const showStatusColored = colored && item?.status?.type
  const amountBalance = formatTokenAmount(balance, decimals, { digits: 4 })
  const shouldRender = withThreshold ? (amountUsd ? new Decimal(amountUsd || 0).gte(selectedThreshold) : true) : true

  ////////
  const MAX_HOURS = 24 // only to debbug
  const now = moment()
  const hoursDiff = now.diff(priceUpdated || 0, 'hours')
  const isOutdated = hoursDiff >= MAX_HOURS
  ////////

  if (!shouldRender) return <></>
  return (
    <>
      <Row key={item?.id} status={showStatusColored} isOpen={isOpen || selectedOpenAll}>
        <TableCell align="left">
          <FlexNoWrap>
            <Network
              network={chainId}
              width={width}
              
            />
          </FlexNoWrap>
        </TableCell>
        <TableCell maxwidth="200px">
          <Column>
            <Flex>
              {symbol}
            </Flex>
          </Column>
        </TableCell>
        <TableCell align="left">
        <Flex>
          
          <Address address={address} chainId={chainId} showIdentity={false} />
        </Flex>
        </TableCell>
        <TableCell maxwidth="200px">
          <FlexNoWrap>
            {amountBalance}
          </FlexNoWrap>
        </TableCell>
        <TableCell align="left">
          <FlexNoWrap>
            {formatPrice(price)}
          </FlexNoWrap>
        </TableCell>
        <TableCell align="left">
        <Flex>

          {formatPrices(amountUsd)} {isOutdated && <Out>⚠</Out>}
          </Flex>

        </TableCell>
        <TableCell>
        <Flex>

          <Space />
          <Details onClick={() => setOpen(!isOpen)}>
            {
              !isOpen ? <span class="chevron right"></span> : <span class="chevron bottom"></span>
            }
          </Details>
          </Flex>

        </TableCell>
      </Row>
      <ExpandableComponent isOpen={isOpen} environment={environment} setOpen={setOpen} item={item}
        selectedOpenAll={selectedOpenAll}
        width={width}
      />
    </>
  )
}

const ExpandableComponent = ({ isOpen, item, width, selectedOpenAll, environment }) => {
  const { data, isLoading } = useLogs(environment, 1, 5, { chainId: item.chainId, token: item?.address }, 50000, isOpen)
  return (
    <>
      <TableRowM>
        <TableCellM colSpan={7} >
          <ExpandableContent expanded={isOpen || selectedOpenAll}>
            <TableRowM>
              <TableCellM colSpan={7} >
                <Extra>
                  <div>

                    {item?.source.map(s => <Line><Address address={s.address} short chainId={item?.chainId} showIdentity={false} /> 
                    - {s.balance} - <Link to={getEtherscanLink(item.chainId, `${item?.address}?a=${s.address}`, 'token')} style={{textDecoration: 'underline'}}>Check </Link></Line>)}
                  </div>
                  <ExtraInfo>
                    Price last updated: {moment(item?.priceUpdated).fromNow()}
                  </ExtraInfo>
                  <FlexOptions>
                    <Link to={`/${environment}/logs?chainId=${item?.chainId}&token=${item?.address}&colored=true`}>Open Logs</Link>
                  </FlexOptions>
                </Extra>
              </TableCellM>
            </TableRowM>

            {isLoading &&
              <Messages>
                Loading executions...
              </Messages>
            }
            {!isLoading && data?.data?.length === 0 &&
              <Messages>
                No data on executions
              </Messages>
            }

            {data?.data?.length > 0 && data?.data?.map((task, i) => (
              <LogsItem
                key={i}
                item={task}
                index={i + 1}
                width={width}
                colored={true}
                handleSelectPlanId={() => console.log('click')}
                lite={true}
              />
            ))}
          </ExpandableContent>
        </TableCellM>
      </TableRowM>
    </>
  )
}



function TableCell({ children, align, lite, ...props }) {
  return (
    <Td {...props} align={align} lite={lite}>
      <Content align={align} >
        {children}
      </Content>
    </Td>
  )
}

const Td = styled.td`
  padding: 10px 5px;
  color: ${props => props.theme.textWhite};
  width: ${props => (props.lite ? '200px' : 'none')};
  vertical-align: middle;
  font-size: 15px;
  text-align: ${props => props.align};
  @media only screen and (max-width: 700px) {
    padding: 20px 10px;
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.align === 'center' ? 'center' : 'flex-start'};
`



const Messages = styled.div`
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 15px 20px;
`

const Extra = styled.div`
      background-color: #dcd7ff17;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      
`
const TableRow = styled.tr``

const TableRowM = styled(TableRow)`
      height: 0px;
`
const Line = styled.div`
width: 100%;
`

const Out = styled.span`
color: yellow;
padding-left: 5px;
`

const Space = styled.div`
      width: 5px;
`
const ExtraInfo = styled.div`
      color: rgb(118, 118, 118);
`

const TableCellM = styled(TableCell)`
      border: none !important;
      padding: 0px;
`

const ExpandableContent = styled.div`
  max-height: ${props => (props.expanded ? '100%' : '0')};
  margin-bottom: ${props => (props.expanded ? '50px' : '0')};
  display: ${props => (props.expanded ? 'inline-table' : 'none')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  width: 100%;
`

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  /* max-width: 250px; */
  padding: 10px 0px;
height: 100%;
`

const FlexOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items:center ;
  /* text-overflow: ellipsis; */
  max-width: 250px;
   a{
    margin: 0px 20px;
    margin-right: 15px;
    text-decoration: underline;
   }
`


const FlexNoWrap = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff80;
  max-width: 200px;
  padding: 10px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`



 const Details = styled.button`
background: rgba(168, 154, 255, 0.10);
transition: background-color 0.3s ease;
color: white;
border: 0px;
padding: 7px 15px;
border-radius: 10px;
min-height: 20px;
min-width: 45px;
cursor: pointer;
&:disabled {
  background: rgba(239, 239, 239, 0.3);
  color: rgba(16, 16, 16, 0.3);
}
.chevron::before {
  border-style: solid;
  border-width: 0.25em 0.25em 0 0;
  content: '';
  display: inline-block;
  height: 5px;
  left: 2.5px;
  position: relative;
  top: 2.5px;
  transform: rotate(-45deg);
  vertical-align: top;
  width: 5px;

}
&.zeropadding {
  padding: 0px !important;
}

.warning {
  color: yellow;
}

.chevron.right:before {
  left: 0;
  transform: rotate(45deg);
}

.chevron.bottom:before {
  top: 2.5px;
  left: 0px;
  transform: rotate(135deg);
}

.chevron.left:before {
  left: 0.25em;
  transform: rotate(-135deg);
}
`
const Row = styled(TableRow)`
 background-color: ${props => (props.isOpen ? '#dcd7ff17' : 'transparent')};
  padding-top: 20px !important;
  &:hover {
    ${Details} {
      background: ${(props) => props.theme.main};
    }
  }
`


export default MonitorItem

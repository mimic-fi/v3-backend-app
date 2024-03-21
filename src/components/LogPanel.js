import { useEffect, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { getEtherscanLink, shortenHash } from '../utils/web3-utils'
import Address from './Address'
import useTaskData from '../hooks/useTaskData'
import LongId from './LongId'
import useTaskMetadata from '../hooks/useTaskMetadata'
import { simulateTransaction } from './tenderlySimulation'
import useTaskPlanId from '../hooks/useTaskPlanId'
import Network from '../utils/Network'

const LogPanel = ({
  open,
  onClose,
  item,
}) => {
  const [simulation, setSimulation] = useState({ status: 'iddle', simulation: null })

  const { data: dataMeta } = useTaskMetadata(item?.id, open)
  const { data: dataPlan } = useTaskPlanId(item?.id, open)

  useEffect(() => {
    setSimulation({ status: 'iddle', simulation: null })
  }, [open]) //only to reset form

  return (
    <Detail isopen={open.toString()}>
      <div className="overlay" onClick={onClose} />
      <div
        className="wrap"
        onClick={e => e.target.tagName.toLowerCase() === 'a' && onClose()}
      >
        <LargeText>Task details</LargeText>
        <DetailItem>
          <StandardText className="label">Task</StandardText>
          <StandardText>{item?.task?.name}</StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">Status</StandardText>
          <StandardText>
            <Label status={item?.status?.type}>{item?.status?.type}</Label>
          </StandardText>
        </DetailItem>
        <TenderButton onClick={() => simulateTransaction(item?.chainId, dataPlan?.blockNumber,
          item?.calldata, item?.task?.address, setSimulation)} disabled={simulation.status !== 'iddle'}>{simulation.status !== 'simulating' ? 'SIMULATE ON TENDERLY' : <span class="loader"></span>}</TenderButton>
        {simulation.status === 'done' &&
          <SimulationDetails>
            <div>
              simulationStatus: {simulation?.simulation?.simulation?.status ? 'success' : 'failed'} {simulation.status === 'bad_simulation' && 'bad_simulation'}
            </div>
            <div>
              simulationError: {simulation?.simulation?.simulation?.error_message}
            </div>
            <Link
              href={`https://www.tdly.co/shared/simulation/${simulation?.simulation?.simulation?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Open Simulation
              {/* <OpenLink alt="" src={openImg} /> */}
            </Link>
          </SimulationDetails>}
        <br></br><br></br>
        <DetailItem>
          <StandardText className="label">Date</StandardText>
          <StandardText>
            {moment.unix(item?.executedAt).format('MMM Do HH:mm:ss')}
          </StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">BlockNumber</StandardText>
          <StandardText>
            {dataPlan?.blockNumber}
          </StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">ChainId</StandardText>
          <StandardText>
            <Network
              network={item?.chainId}
              small="false"
              noLogo={true}
            />
            ({item?.chainId})
          </StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">ID</StandardText>
          <StandardText>
            {item?.id}
          </StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">PlanId</StandardText>
          <StandardText>
            {item?.planId}
          </StandardText>
        </DetailItem>
        <DetailItem>
          <StandardText className="label">Task address</StandardText>
          <Address address={item?.task?.address} chainId={item?.chainId} short />
        </DetailItem>

        <DetailItem>

          <StandardText className="label">Smart Vault</StandardText>
          <Address address={item?.smartVault} chainId={item?.chainId} short showIdentity={false} />
        </DetailItem>

        <StandardText className="label">Token In</StandardText>

        <StandardText>
          <div><LongId longId={item?.in?.token} /></div>
          <div>Amount: {item?.in?.amount}</div>
          <div>Price: ${item?.in?.amountUsd}</div>
        </StandardText>
        {
          item?.out?.map(t => {
            return (
              <>              <StandardText className="label">Token Out</StandardText>
                <StandardText>
                </StandardText>
                <StandardText>
                  <LongId longId={t.token} />
                  <div>Amount: {t.amount}</div>
                  <div>Price: ${t.amountUsd}</div>
                </StandardText>
              </>
            )
          })
        }

        {item?.status?.type === ('success' || 'reverted') && <RenderTransactionInfo item={item} isOpen={open} />}

        <br />
        <StandardText className="label">CallData</StandardText>
        <StandardText>
          <LongId longId={item?.calldata} />
        </StandardText>
        <br />
        <StandardText className="label">Metadata</StandardText>
        <StandardText>
          <Flex>
            {JSON.stringify(dataMeta)}
          </Flex>
        </StandardText>
      </div>
    </Detail>
  )
}

const RenderTransactionInfo = ({ item }) => {
  const { data } = useTaskData(item?.id)

  return (
    <>
      <br />
      <LargeText>Transaction Info</LargeText>
      <StandardText className="label">Transaction Sender</StandardText>
      <StandardText>
        <Address address={data?.sender} chainId={data?.chainId} short />
      </StandardText>
      <StandardText className="label">Transaction Hash</StandardText>
      <StandardText>
        <Link
          href={getEtherscanLink(
            data?.chainId,
            data?.hash,
            'transaction'
          )}
          target="_blank"
          rel="noreferrer"
        >
          <StandardText color="#A996FF">{shortenHash(data?.hash)}</StandardText>
          {/* <OpenLink alt="" src={openImg} /> */}
        </Link>

      </StandardText>

    </>

  )
}


const statusStyles = {
  notSimulated: {
    backgroundColor: "#ef406f1f",
    backgroundLabel: "#ef406fb5",
    colorLabel: "#ffffffc7",
  },
  simulationFailed: {
    backgroundColor: "#d3851636",
    backgroundLabel: "#d36a1663",
    colorLabel: "#ffffffc7",
  },
  simulationReverted: {
    backgroundColor: "#80008012",
    backgroundLabel: "#80008063",
    colorLabel: "#ffffffc7",
  },
  simulationSucceeded: {
    backgroundColor: "#d2d31636",
    backgroundLabel: "#d2d31663",
    colorLabel: "#fff",
  },
  executionDelayed: {
    backgroundColor: "#d75d0c4f",
    backgroundLabel: "#d3781662",
    colorLabel: "#fff",
  },
  executionSucceeded: {
    backgroundColor: "#33c2b036",
    backgroundLabel: "#33c2b0",
    colorLabel: "#fff",
  },
  executionReverted: {
    backgroundColor: "#7d23552e",
    backgroundLabel: "#7d23552e",
    colorLabel: "#fff",
  },
  executionNotReached: {
    backgroundColor: "rgba(197,127,66,0.34)",
    backgroundLabel: "#7a4321",
    colorLabel: "#fff",
  },
  transactionReverted: {
    backgroundColor: "#DE0000",
    backgroundLabel: "#DE0000",
    colorLabel: "#fff",
  },
}

const Link = styled.a`
  display: flex;
  align-items: center;
`

const TenderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 0px 0px 10px 0px;
  .loader {
    width: 20px;
    height: 20px;
    border: 2px solid #6f4df39e;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    animation: pulse 1s linear infinite;
}
.loader:after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #6f4df39e;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: scaleUp 1s linear infinite;
}

@keyframes scaleUp {
  0% { transform: translate(-50%, -50%) scale(0) }
  60% , 100% { transform: translate(-50%, -50%)  scale(1)}
}
@keyframes pulse {
  0% , 60% , 100%{ transform:  scale(1) }
  80% { transform:  scale(1.2)}
}
`

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  white-space: break-spaces;
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  margin-bottom: 40px;
  p {
    margin: 0;
    word-break: break-word;
    display: flex;
    align-items: center;
  }
  .relative {
    position: relative;
  }
`

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 105px;
  background-color: ${(props) =>
    statusStyles[props.status]?.backgroundLabel || 'transparent'};
  color: ${(props) => statusStyles[props.status]?.colorLabel || '#fff'};
  padding: 2px 7px;
  border-radius: 5px;
`

const SimulationDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
  a {
    color: #b76b8d;
    text-decoration: underline;
    cursor: pointer;
  }
`

const Detail = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  word-break: break-word;
  .label {
    color: ${props => props.theme.textGrey};
  }

  .overlay {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    will-change: opacity;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
  }

  ${props =>
    props.isopen === 'true' && '.overlay { opacity: 1; pointer-events: auto;}'};

  .wrap {
    position: fixed;
    box-sizing: border-box;
    height: 100%;
    width: 504px;
    @media only screen and (max-width: 510px) {
      width: 100%;
    }
    padding: 50px;
    background: #000;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translateX(-100%);
    will-change: transform;
    z-index: 101;
    pointer-events: auto;
    transition: transform 130ms ease-out;
    right: 0;
    transform: translateX(100%);
  }

  ${props =>
    props.isopen === 'true' &&
    '.wrap { transform: none; pointer-events: auto; transition: transform 330ms ease-in;}'};

  h2 {
    text-align: left !important;
  }
  .token {
    width: 26px;
    padding-left: 7px;
  }
`

const OpenLink = styled.img`
  height: 20px;
  padding-left: 7px;
`
export const LargeText = styled.p`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: 'DMSans';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 1px;
`
export const StandardText = styled(LargeText)`
  font-size: 16px;
  line-height: 22px;
`

export default LogPanel

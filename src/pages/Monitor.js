import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import arrowDown from '../assets/arrow-down.svg'
// import MonitorItem from '../sections/MonitorItem'
import useSimpleMonitor from '../hooks/useSimpleMonitor'
import useManyTokenInfo from '../hooks/useManyTokenInfo'
import useTokenPrices from '../hooks/useTokenPrices'
import { aLessB, formatAmountPrice } from '../utils/math-utils'
import { ContainerTable } from '../utils/styles'
import Network from '../utils/Network'
import { CHAIN_INFO, SupportedChainId } from '../constants/chainInfo'
import MonitorItem from '../components/MonitorItem'
// import TableCell from '../structure/Table/TableCell'

const Monitor = () => {
  const params = useParams()
  const buttonRef = useRef(null)
  const defaultChain =  1
  const [selectedView, setSelectedView] = useState('TABLE')
  const [selectedNetwork, setSelectedNetwork] = useState(defaultChain)
  const [selectedOpenAll, setSelectedOpenAll] = useState(false)
  const [selectedThreshold, setSelectedThreshold] = useState(100)
  const [usingThreshold, setUsingThreshold] = useState(false)
  const [filters, setFilters] = useState({})
  const [dat, setDat] = useState([])
  const [page, setPage] = useState(1)
  const [loadPageData, setLoadPageData] = useState(1)
  const [totalPagesData, setTotalPagesData] = useState(1)
  const [loadPagePrice, setLoadPagePrice] = useState(1)
  const [totalPagesPrice, setTotalPagesPrice] = useState(1)
  const [limit] = useState(50)
  const { summary, isLoading, tokenList } = useSimpleMonitor(
    params.id,
    page,
    200,
    filters,
    0
  )

  const { data: dataTokenInfo, isFetched: isFetchedTokenInfo } =
    useManyTokenInfo(tokenList, filters, limit, setLoadPageData, setTotalPagesData)

  const { data: dataTokenPrices, isLoading: isLoadingTokenPrices, isFetched: isFetchedTokenPrices } =
    useTokenPrices(tokenList, filters, limit, setLoadPagePrice, setTotalPagesPrice)

  const navigate = useNavigate()
  const location = useLocation()
  let sortedData = []

  // complex function to 
  const aggregateFull = (summary, dataTokenInfo, dataTokenPrices) => {
    const aggregated = {}
    summary.forEach(token => {
      const { balance, address, source } = token

      if (!aggregated[address]) {
        aggregated[address] = {
          balance,
          address,
          source
        }
      }
      try {
        if (dataTokenInfo && Object.values(dataTokenInfo).length > 0 && dataTokenInfo[address]) {
          const { symbol, chainId, decimals } = dataTokenInfo[address]
          aggregated[address].symbol = symbol
          aggregated[address].chainId = chainId
          aggregated[address].decimals = decimals || 18
        }
      } catch (error) {
        console.log('tokenInfo', address, error)
      }

      try {
        if (dataTokenPrices && dataTokenInfo[address]) {
          const pricing = dataTokenPrices?.find(t => address === t?.address)
          aggregated[address].price = pricing?.price
          aggregated[address].priceUpdated = pricing?.date
          aggregated[address].amountUsd = formatAmountPrice(balance, pricing?.price, dataTokenInfo[address]?.decimals)
        }
      } catch (error) {
        console.log('dataTokenPrices', address, error)
      }
    })

    return Object.values(aggregated).sort((a, b) => aLessB(b.amountUsd || 0, a.amountUsd || 0))
  }

  const updateURL = (newFilters) => {
    const searchParams = new URLSearchParams()

    // Add filter parameters to the URL search params
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        searchParams.set(key, newFilters[key])
      } else {
        // Remove the parameter if the value is empty
        searchParams.delete(key)
      }
    })
    // For React Router v6
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    })
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token') || ''
    const chainId = searchParams.get('chainId') || selectedNetwork
    const withThreshold = searchParams.get('withThreshold') || ''
    const openAll = searchParams.get('openAll') || ''
    const threshold = searchParams.get('threshold') || ''

    setSelectedNetwork(chainId)
    setFilters({ token, threshold, chainId })
    setSelectedOpenAll(openAll)
    setUsingThreshold(withThreshold)
    setSelectedThreshold(threshold.replace('$', ''))

    updateURL({ token, threshold, chainId })
    // eslint-disable-next-line
  }, []); // Empty dependency array to run only on component mount

  const handleImageClick = () => {
    buttonRef.current.dispatchEvent(new Event('click', { bubbles: true }))
  }

  const handleSelectChange = (e) => {
    setSelectedNetwork(e.target.value)
    setPage(1)
    if (e.target.value !== '') {
      setFilters({ ...filters, chainId: e.target.value })
      updateURL({ ...filters, chainId: e.target.value })

    } else {
      const { chainId, ...otherFilters } = filters
      setFilters({ ...otherFilters })
      updateURL({ ...otherFilters })

    }
  }

  const handleRealTimeChange = (e) => {
    setUsingThreshold(!usingThreshold)
    updateURL({ ...filters, openAll: selectedOpenAll, usingThreshold: !usingThreshold })
  }

  const handleColored = (e) => {
    setSelectedOpenAll(!selectedOpenAll)
    updateURL({ ...filters, realtime: usingThreshold, openAll: !selectedOpenAll })
  }

  const handleSelectThreshold = (limit) => {
    setSelectedThreshold(limit.replace('$', ''))
    setPage(1)
    setTimeout(() => {
      if (limit !== '') {
        setFilters({ ...filters, threshold: limit })
        updateURL({ ...filters, threshold: limit })
      } else {
        // Remove the token filter when the value is empty
        const { threshold, ...otherFilters } = filters
        setFilters({ ...otherFilters })
        updateURL({ ...otherFilters })
      }
    }, 500)
  }

  function convertData(obj) {
    if (!obj.source || !Array.isArray(obj.source)) {
      return [] // Return an empty array if obj.source is not an array
    }
    return obj.source.map(s => ({
      sourceAddress: s.address, 
      address: obj.address,
      symbol: obj.symbol,
      decimals: obj.decimals,
      chainId: obj.chainId,
      amount: s.balance,
      price: obj.price,
      amountUsd: formatAmountPrice(s.balance, obj?.price, obj?.decimals),
      priceUpdated: obj.priceUpdated,
    }))
  }

  function objectToCsv(data) {
    if (data.length === 0) {
      return '' // Return an empty string if there is no data
    }
  
    // Assuming the structure of each object returned by convertData is the same
    // We use the first element to determine the headers
    const headers = Object.keys(convertData(data[0])[0])
    const csvRows = [headers.join(',')] // Add headers as the first row
  
    for (const item of data) {
      const convertedData = convertData(item) // Convert each item
      for (const row of convertedData) {
        const values = headers.map(header => {
          const value = row[header]
          return `"${value}"` // Enclose each value in quotes to handle commas and line breaks
        })
        csvRows.push(values.join(',')) // Add the row to CSV rows
      }
    }
  
    return csvRows.join('\n')
  }

  function download(csvData) {
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `monitor-${params.id}-chainId-${selectedNetwork}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleDownload = () => {
    const csvData = objectToCsv(dat)
    download(csvData)
  }

  const formatThreshold = (value) => `$${value}`

  useEffect(() => {
    setDat(aggregateFull(summary, dataTokenInfo, dataTokenPrices))

    // eslint-disable-next-line
  }, [summary, dataTokenInfo, dataTokenPrices]); // Empty dependency array to run only on component mount

  return (
    <ActivitySection>
        <div>Monitor {summary?.length ? `(${summary?.length})` : ''}</div>
        <Flex>
          <div className="custom-select-container">
            <select
              value={selectedNetwork}
              onChange={handleSelectChange}
              className="custom-select"
              ref={buttonRef}
            >
              <option value="">All Networks</option>
              {Object.values(SupportedChainId).map((chainId) => (
                <option key={chainId} value={chainId}>
                  <Network network={CHAIN_INFO[chainId].name} noLogo={true} />
                </option>
              ))}
            </select>
            <div
              id="arrow-container"
              className="arrow-container"
              onClick={handleImageClick}
            >
              <img src={arrowDown} alt="Arrow" />
            </div>
          </div>
          

          <div className="custom-plan-container">
            <Details onClick={() => setSelectedView('TABLE')} disabled={isLoading}>All</Details>
          </div>
          <div className="custom-plan-container">
            <Details onClick={() => setSelectedView('MONITOR')} disabled={isLoading}>Monitor</Details>
          </div>
          <div className="custom-plan-container">
            <Details onClick={() => setSelectedView('PRICES')} disabled={isLoadingTokenPrices}>Prices</Details>
          </div>

          <div className="custom-plan-container">
            <Details onClick={() => handleDownload()} disabled={isLoading}>CSV</Details>
          </div>

          <div className="custom-plan-container">
            <input
              value={formatThreshold(selectedThreshold)}
              placeholder="threshold"
              onChange={(e) => handleSelectThreshold(e.target.value)}
              className="custom-plan"
            />
          </div>
          <Details onClick={handleColored}>
            <Flex>
              Open all{" "}
              <Switch mode={selectedOpenAll}>{selectedOpenAll ? "ON" : "OFF"}</Switch>
            </Flex>
          </Details>
          <Details onClick={handleRealTimeChange}>
            <Flex>
              Use threshold{" "}
              <Switch mode={usingThreshold}>{usingThreshold ? "ON" : "OFF"}</Switch>
            </Flex>
          </Details>
          <FlexRowRight>
            <div className={'custom-load-container'}>
              Monitor {`(${summary?.length})`} {isLoading ? <span className='loading'>Loading!</span> : <span className='done'>✓</span>}
            </div>
            <div className={'custom-load-container'}>
              Tokens Data {`(${Object?.values(dataTokenInfo || {})?.length})`} {!isFetchedTokenInfo ? <span className='loading'>Loading! {`${loadPageData}/${totalPagesData}`}</span> : <span className='done'>✓</span>}

              {/* Tokens Data {!isFetchedTokenInfo ? <span className='loading'>Loading!</span> : <span className='done'>✓</span>} */}
            </div>
            <div className={'custom-load-container'}>
              Prices {`(${dataTokenPrices?.length || 0})`} {!isFetchedTokenPrices ? <span className='loading'>Loading! {`${loadPagePrice}/${totalPagesPrice}`}</span> : <span className='done'>✓</span>}
            </div>

          </FlexRowRight>

        </Flex>
        <GenericTable
          selectedView={selectedView}
          index='MONITOR'
          data={summary}
          isLoading={isLoading}
        />
        <GenericTable
          selectedView={selectedView}
          index='PRICES'
          data={dataTokenPrices}
          isLoading={isLoadingTokenPrices}
        />
        <ShowTable
          selectedView={selectedView}
          isLoading={isLoading}
          summary={summary}
          oa={dat}
          width={1200}
          selectedOpenAll={selectedOpenAll}
          handleSelectThreshold={handleSelectThreshold}
          selectedThreshold={selectedThreshold}
          params={params}
          threshold={selectedThreshold}
          usingThreshold={usingThreshold}
        />

    </ActivitySection>
  )
}

const ShowTable = ({ selectedView, isLoading, summary, oa, width, selectedOpenAll,
  handleSelectThreshold,
  selectedThreshold,
  params,
  usingThreshold
}) => {
  if (selectedView !== 'TABLE') return <></>
  return (

    isLoading ? (
      <>
        <br />
        <br />
        Loading...
      </>
    ) : summary?.length > 0 ? (
      <Table>
            <thead>
            <tr>
              <th>Network</th>
                <th>Symbol</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Price</th>
                <th>USD</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
    

        {/* {summaryLastExecution ? 'loading executions...' : null} */}
        {oa?.map((task, i) => (
          <MonitorItem
            key={i}
            item={task}
            index={i + 1}
            width={width}
            openAll={selectedOpenAll}
            handleSelectThreshold={handleSelectThreshold}
            selectedThreshold={selectedThreshold}
            environment={params.id}
            // tokenInfo={}
            // tokenPrice={dataTokenPrices?.find(t => task?.address === t.address) || defaultPrice}
            // isLoadingLastExecution={isLoadingLastExecution}
            // dataLastExecution={dataLastExecution}
            selectedOpenAll={selectedOpenAll}
            withThreshold={usingThreshold}
          />
        ))}
            </tbody>

      </Table>
    ) : (
      <div>No summary to show here yet</div>
    )
  )
}

const GenericTable = ({ data, isLoadingResponse, index, selectedView }) => {
  console.log('GenericTable', index, data)
  if (index !== selectedView) return <></>
  if (isLoadingResponse) {
    return <div>Loading...</div>
  }

  const headers = data && data?.length > 1 ? Object?.keys(data[0]) : []

  return (
    <Table>
      <thead>
        <tr>
          {headers?.length && headers?.map(header => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {headers?.length && data?.map((row, index) => {
          return (
            <tr key={index}>
              {headers?.map(header => {
                return (<TableCell key={header}>{JSON.stringify(row[header])}</TableCell>)
              })}
            </tr>
          )
        }

        )}
      </tbody>
    </Table>
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



const ActivitySection = styled.section`
    margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
  select {
    padding: 6px 13px 6px 16px;
    border: 0px;
    background: #232632;
    color: white;
    border-radius: 10px;
    font-family: "DMSans";
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
    outline: none !important;
  }

  .custom-select-container {
    position: relative;
    display: inline-block;
    margin-right: 20px;
  }

  .custom-plan-container {
    position: relative;
    display: inline-block;
    margin-right: 20px;
  }

  .custom-load-container {
    display: flex;
    margin: 0px 20px;
    color: rgb(118, 118, 118);
    font-size: 14px;
  }

  .loading {
    color: #d2d31663;
    padding-left: 5px;
  }

  .done {
    color: #33c2b0;
    padding-left: 5px;

  }

  .custom-realtime-container {
    display: inline-block;
    color: rgb(118, 118, 118);
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .custom-loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    margin-bottom: 21px;
  }

  .custom-select {
    padding: 6px 13px 6px 16px;
    min-width: 150px;
    border: 0px;
    background: rgba(168, 154, 255, 0.1);
    color: white;
    border-radius: 10px;
    font-family: "DMSans";
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
    outline: none !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .custom-plan {
    padding: 6px 13px 6px 16px;
    max-width: 100px;
    border: 0px;
    background: rgba(168, 154, 255, 0.1);
    color: white;
    border-radius: 10px;
    font-family: "DMSans";
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
    outline: none !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .arrow-container {
    position: absolute;
    transform: translateY(-50%);
    top: 55%;
    right: 13px;
  }

  .arrow-container img {
    height: 15px;
    width: 15px;
    object-fit: contain;
    height: 100%;
  }
`

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 150px;
 
`
const FlexRowRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

    width: 100%;
    align-items: flex-end;
`

export const Details = styled.button`
  display: flex;
  justify-items: center;
  align-items: center;
  background: ${(props) => (!props.selected ? " rgba(168, 154, 255, 0.10)" : "#6F5CE6")};
  transition: background-color 0.3s ease;
  color: white;
  border: 0px;
  padding: 10px 15px;
  border-radius: 10px;
  margin-right: 20px;
  height: 50px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    background: rgba(239, 239, 239, 0.3);
    color: rgba(16, 16, 16, 0.3);
  }

  &:hover {
    background: ${(props) => props.theme.main};
  }
`;

const SwitchText = styled.div`
  background-color: #5dc89a85;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  height: 22px;
  padding: 0px 5px;
  margin-left: 10px;
  border-radius: 10px;
  font-weight: 200;
  font-size: 12px;
`;

const Switch = styled.div`
  background-color: ${(props) => (props.mode ? "#5dc89a85" : "#cd578e85")};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  height: 22px;
  padding: 0px 2px;
  margin-left: 10px;
  border-radius: 10px;
  font-weight: 200;
  font-size: 10px;
`;


const Table = styled(ContainerTable)`
  overflow-x: auto;
  max-width: 100%;
  min-height: 80%;
  position: relative;

  td {
    /* padding: 0px 10px !important; */
  }
  td.networks{
    min-width: 156px;
  }
  .accent {
    color: #33C2B0;
    font-weight: bold;
    font-family: 'DMSansBold';
  }
  .accent-2 {
    color: #ff975f;
    font-weight: bold;
    font-family: 'DMSansBold';
 
  }
  a {
        &:hover {
            text-decoration: underline;
        }
    }

  th:first-child {
    min-width: 150px;
    max-width: 200px;
    position: sticky;
    left: 0;
    z-index: 1;
    padding: 0px 15px;
    /* background-color: #2D2C44; */
  }

  tbody {
    tr {
      td:first-child {
        /* position: sticky; */
        /* left: 0; */
        padding: 0px 0px;
        min-width: 150px;
        
        /* background-color: #2D2C44; */
      }
    }
  }
`

export default Monitor

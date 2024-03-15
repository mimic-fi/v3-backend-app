// @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ContainerTable, Section, FlexButtons, LoadingTable, Details } from '../utils/styles';
import Address from '../utils/Address';
import styled from 'styled-components'

interface EnvironmentsProps {
  onSuccess?: () => void;
}

interface ResponseData {
  name: string;
  simulations: number;
  executions: number;
  volume: number;
  fees: number;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const EnvironmentsYearly: React.FC<EnvironmentsProps> = ({ onSuccess = () => { } }) => {
  const [activeTab, setActiveTab] = useState('accounting');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDataForCurrentYear();
  }, [year]);

  const fetchDataForCurrentYear = async () => {
    try {
      const promises = [];

      for (let month = 0; month < 12; month++) {

        const startDate = new Date(year, month, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

        const promise = axios.get(`${URL}/relayer-executor/environments/report`, {
          params: {
            startDate,
            endDate,
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        promises.push(promise);
      }

      const responses = await Promise.all(promises);

      const mergedData: { [key: string]: any[] } = {};
      responses.forEach(response => {
        Object.entries(response.data).forEach((entry: [string, ResponseData]) => {
          const [key, value] = entry;

          if (!mergedData[key]) {
            mergedData[key] = [];
          }

          let resultValue: { simulations: number; executions: number; volume: number; fees: number, gasCharged: number; gasUsed: number } = {
            simulations: 0,
            executions: 0,
            volume: 0,
            fees: 0,
            gasCharged: 0,
            gasUsed: 0,
            name: '',
          };

          for (const key1 in value) {
            const item = value[key1];
            resultValue.simulations += item.simulations;
            resultValue.executions += item.executions;
            resultValue.volume += item.volume;
            resultValue.fees += item.fees;
            resultValue.gasCharged += item.gasCharged;
            resultValue.gasUsed += item.gasUsed;
          }
          resultValue.name = Object.values(value)[0].name
          mergedData[key].push(resultValue);
        });
      });
      setData(mergedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLastYearButtonClick = () => {
    setYear(prevYear => prevYear - 1);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Section>
      <FlexButtons>
      <Details
          selected={activeTab === 'accounting'}
          onClick={() => handleTabClick('accounting')}>
          Accounting
          </Details>
        <Details
          selected={activeTab === 'gas' }
          onClick={() => handleTabClick('gas')}>
          Gas
        </Details>
        <Details
          selected={activeTab === 'executions' }
          onClick={() => handleTabClick('executions')}>
          Executions
        </Details>
      </FlexButtons>
      {Object.keys(data).length === 0 ? <LoadingTable>Loading...</LoadingTable> :
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Environment</th>
              <th>Jan</th>
              <th>Feb</th>
              <th>Mar</th>
              <th>Apr</th>
              <th>May</th>
              <th>Jun</th>
              <th>Jul</th>
              <th>Aug</th>
              <th>Sep</th>
              <th>Oct</th>
              <th>Nov</th>
              <th>Dec</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([externalKey, internalData]) => (
              <>
                <tr key={externalKey}>
                  <td className="accent">{Object.values(data[externalKey])[0].name}</td>
                  <td>
                    <Address
                      address={externalKey}
                      short={true}
                      showIdentity={false}
                      withLink={false}
                      chainId={1} />
                  </td>
                  {Object.entries(internalData).map(([internalKey, value], index) => (
                    <React.Fragment key={externalKey + '-' + internalKey}>
                      <td className="months">
                        <div>
                          {activeTab === 'executions' &&
                            <>
                              Simulations: {value.simulations ? <span className="accent-2">{value.simulations}</span> : '0'}<br />
                              Executions: {value.executions ? <span className="accent-2">{value.executions}</span> : '0'}
                            </>
                          }
                          {activeTab === 'gas' &&
                            <>
                              Charged: {value.gasCharged ? <span className="accent-2">$ {value.gasCharged.toFixed(2)}</span> : '$ 0'}<br />
                              Used: {value.gasUsed ? <span className="accent-2">$ {value.gasUsed.toFixed(2)}</span> : '$ 0'}
                            </>
                          }
                          {activeTab === 'accounting' &&
                            <>
                              Vol: {value.volume ? <span className="accent-2">$ {value.volume.toFixed(2)}</span> : '$ 0'}<br />
                              Fees: {value.fees ? <span className="accent-2">$ {value.fees.toFixed(2)}</span> : '$ 0'}<br />
                            </>
                          }
                        </div>
                      </td>
                    </React.Fragment>
                  ))}
                  {Array.from({ length: 12 - Object.keys(internalData).length }).map((_, index) => (
                    <td key={index}></td>
                  ))}
                  <td className="months">
                    {activeTab === 'executions' &&
                      <>
                        Total Simulations: <span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.simulations, 0)}</span><br />
                        Total Executions:  <span className="accent">{Object.values(internalData).reduce((acc, cur) => acc + cur.executions, 0)}</span>
                      </>
                    }
                    {activeTab === 'gas' && (
                      <>
                        Total Charged: <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.gasCharged, 0).toFixed(2)}</span><br />
                        Total Used:  <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.gasUsed, 0).toFixed(2)}</span>
                      </>
                    )}
                    {activeTab === 'accounting' && (
                      <>
                        Total Volume: <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.volume, 0).toFixed(2)}</span><br />
                        Total Fees:  <span className="accent">$ {Object.values(internalData).reduce((acc, cur) => acc + cur.fees, 0).toFixed(2)}</span>
                      </>
                    )}
                  </td>
                </tr>
                <tr className="empty-row"></tr>
              </>
            ))}
          </tbody>
        </Table>}
    </Section>
  );
};

const Table = styled(ContainerTable)`
  overflow-x: auto;
  max-width: 100%;
  position: relative;

  td.months {
    width: 230px;
  }
  .accent {
    color: #33C2B0;
    font-wight: bold;
    font-family: 'DMSansBold';
  }
  .accent-2 {
    color: #ff975f;
    font-wight: bold;
    font-family: 'DMSansBold';
  }

  th:first-child {
    min-width: 200px;
    max-width: 200px;
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #2D2C44;
  }

  tbody {
    tr {
      td:first-child {
        position: sticky;
        left: 0;
        background-color: #2D2C44;
      }
    }
  }
`


export default EnvironmentsYearly;

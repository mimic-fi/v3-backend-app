import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ContainerTable } from "../utils/styles";
import Network from "../utils/Network";
import { Link } from "react-router-dom";
import Address from "../utils/Address";

interface Environment {
  namespace: string;
  chainIds: number[];
  mimicId: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const EnvironmentsList: React.FC = () => {
  const [data, setData] = useState<Environment[] | null>(null);

  async function fetchEnvironments(): Promise<Environment[]> {
    const response = await axios.get<Environment[]>(
      `${URL}/public/environments/`
    );
    setData(response.data);
    return response.data;
  }

  useEffect(() => {
    fetchEnvironments();
  }, []);

  return (
    <Section>
      {data ? (
        <>
          <Table>
            <thead>
              <tr>
                <th className="networks">Name</th>
                <th>id</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td  className="accent">{item.namespace}</td>
                  <td>
                    <Column>
                    <Address
                        address={item.mimicId}
                        short={false}
                        showIdentity={false}
                        withLink={false}
                        chainId={1} />
                    
                    <Stack>
                    {item.chainIds.map((c) => {
                      return <Network network={c} width={1200} small />;
                    })}
                    </Stack>
                    </Column>
                    </td>
                  <td>
                    <Link to={`/dashboard/environments/${item.mimicId}/logs`} className="accent-2"> Logs</Link> | 
                    <Link to={`https://app.mimic.fi/${item.mimicId}`} className="accent-2" target="_blank"> Explorer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Section>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Stack = styled.div`
  display: flex;
  margin: 5px 0px;
`;


const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

const Table = styled(ContainerTable)`
  overflow-x: auto;
  max-width: 100%;
  position: relative;

  td.networks{
    min-width: 156px;
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

export default EnvironmentsList;
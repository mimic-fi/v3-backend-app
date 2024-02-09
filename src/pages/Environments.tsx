import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ContainerTable } from "../utils/styles";
import Network from "../utils/Network";
import { Link } from "react-router-dom";

interface Environment {
  namespace: string;
  chainIds: number[];
  mimicId: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const Enviroments: React.FC = () => {
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
          <ContainerTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>id</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td>{item.namespace}</td>
                  <td>
                    <Column>
                    {item.mimicId}
                    <Stack>
                    {item.chainIds.map((c) => {
                      return <Network network={c} width={1200} small />;
                    })}
                    </Stack>
                    </Column>
                    </td>
                  <td>
                    <Link to={`${item.mimicId}/logs`}> Logs</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </ContainerTable>
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

export default Enviroments;

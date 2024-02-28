// @ts-nocheck
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSubgraphs from '../hooks/useSubgraphs';
import { ContainerTable } from '../utils/styles';
import Network from '../utils/Network';

const StatusRelayer: React.FC = () => {
  const data = useSubgraphs()

  return (
    <Section>
      {!data.isLoading ? (
        <>
          <ContainerTable>
            <thead>
              <tr>
                <th>Network</th>
                <th>Subgraph</th>
                <th>Synced</th>
                <th>Fatal Error</th>
                <th>Non Fatal Errors</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((item, index) => (
                <tr key={index}>
                  <td><Network network={item.chainId} width={1200} /></td>
                  <td>{item.subgraph}</td>
                  <td>{item.synced ? '🟢' : '🔴'}</td>
                  <td>{item.fatalError ? item.fatalError : '-'}</td>
                  <td>
                    {item.nonFatalErrors.map((error, key) => (
                      <p key={key}>
                        {error}
                      </p>
                    ))}
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



const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

export default StatusRelayer;

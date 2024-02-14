import styled from 'styled-components'

export const ContainerTable = styled.table`
  background-color: rgba(168, 154, 255, 0.12);
  border-radius: 24px;
  margin-top: 50px;
  min-width: 500px;
  tbody tr:hover {
    background: rgba(0, 0, 0, 0.24);
  }
  th {
    padding-top: 10px;
    text-align: left;
    padding-bottom: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.50);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  td:first-child,
  th:first-child {
    padding-left: 25px;
    white-space: nowrap;
    text-align: left;
  }
  td:last-child,
  th:last-child {
    padding-right: 25px;
    text-align: left;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    border-left: 0;
    border-right: 0;
    vertical-align: top;
  }
  tr:last-child td {
    border-bottom: 0px solid;
  }
  th,
  td {
    text-align: left;
  }

  th {
    padding: 20px 8px;
  }
`

export const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const LoadingTable = styled.div`
  margin-top: 50px;
  `

export const FlexButtons = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
  button {
    background: #6f5ce6;
    color: white;
    border: 0px solid;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    &.active, &:hover {
      background: #582ea0;
    }


  }
`;

export const LittleButton = styled(Button)`
  padding: 3px 7px;
  font-size: 12px;
  margin: 0px 2px;
`;


export const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
  min-height: calc(100vh - 150px);
`;

export const Tab = styled.div`
  width: 100%;
  background: #6f5ce6;
  padding: 0;
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    margin-top: 0!important;
    border-radius: 0!important;
    padding: 10px 15px;
    cursor: pointer;
    border: none;
    background: none;
    color: white;
    font-size: 16px;

    &.active {
      border-bottom: 2px solid white;
    }

    &:not(:last-child) {
      margin-right: 20px;
    }
  }
`;

import styled from 'styled-components'

export const ContainerTable = styled.table`
  background-color: rgba(168, 154, 255, 0.12);
  border-radius: 24px;
  margin-top: 50px;
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

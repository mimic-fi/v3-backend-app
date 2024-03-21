// @ts-nocheck

import { useState } from "react";
import moment from "moment";
import styled from "styled-components";
import flow from "../assets/logs/Flow.svg";
import { Link } from "react-router-dom";
import Network from "../utils/Network";
import { TasksDictionary } from "../constants/taskDictionary";
import LogsDetail from "./LogDetails";
import { shortenAddress } from "../utils/web3-utils";
import LogPanel from "./LogPanel";

const LogsItem = ({
  item,
  width,
  colored,
  handleSelectPlanId,
  lite = false,
}) => {
  const [isOpen, setOpen] = useState(false);
  const icon = TasksDictionary[item?.task?.executionType]?.icon;
  const showStatusColored = colored && item?.status?.type;
  return (
    <>
      <Row key={item?.id} status={showStatusColored}>
        <TableCell lite={lite}>
          <Success>
            <Status
              status={item?.status?.type}
              width={width}
              text={moment(item?.executedAt).fromNow()}
            />
          </Success>
          <LogPanel
            open={isOpen}
            item={item}
            onClose={() => setOpen(!isOpen)}
          />
        </TableCell>
        <TableCell align="left">
          <FlexNoWrap>
            <Network network={item?.chainId} width={width} noLogo={true} />
          </FlexNoWrap>
        </TableCell>
        <TableCell lite={lite}>
          <Flex>
            <ActionIcon
              src={icon ? icon : flow}
              alt={item?.task?.executionType}
            />
            {item?.task.name}
          </Flex>
        </TableCell>
        <TableCell align="left">
          <Label status={showStatusColored}>{item?.status?.type}</Label>
        </TableCell>
        <TableCell>
          <LogsDetail item={item} />
        </TableCell>
        <TableCell align="left">
          <FlexNoWrap>
            <Linked onClick={() => handleSelectPlanId(item?.planId)}>
              {shortenAddress(item?.planId)}{" "}
            </Linked>
            {` #${item?.index} `}
          </FlexNoWrap>
        </TableCell>
        <TableCell>
          <Details onClick={() => setOpen(!isOpen)}>Details</Details>
        </TableCell>
      </Row>
    </>
  );
};

const statusStyles = {
  notSimulated: {
    backgroundColor: "#ef406f1f",
    backgroundLabel: "#ef406fb5",
    colorLabel: "#ffffffc7",
    color: "#FFF",
  },
  simulationFailed: {
    backgroundColor: "#d3851636",
    backgroundLabel: "#d36a1663",
    colorLabel: "#ffffffc7",
    color: "#FFF",
  },
  simulationReverted: {
    backgroundColor: "#80008012",
    backgroundLabel: "#80008063",
    colorLabel: "#ffffffc7",
    color: "#FFF",
  },
  simulationSucceeded: {
    backgroundColor: "#d2d31636",
    backgroundLabel: "#d2d31663",
    colorLabel: "#fff",
    color: "#FFF",
  },
  executionDelayed: {
    backgroundColor: "#d75d0c4f",
    backgroundLabel: "#d3781662",
    colorLabel: "#fff",
    color: "#FFF",
  },
  executionSucceeded: {
    backgroundColor: "#33c2b036",
    backgroundLabel: "#33c2b0",
    colorLabel: "#fff",
    color: "#33C2B0",
  },
  executionReverted: {
    backgroundColor: "#7d23552e",
    backgroundLabel: "#7d23552e",
    colorLabel: "#fff",
    color: "#DE0000",
  },
  executionNotReached: {
    backgroundColor: "rgba(197,127,66,0.34)",
    backgroundLabel: "#7a4321",
    colorLabel: "#fff",
    color: "#FFF",
  },
  transactionReverted: {
    backgroundColor: "#DE0000",
    backgroundLabel: "#DE0000",
    colorLabel: "#fff",
    color: "#DE0000",
  },
};

const Flex = styled.div`
  display: flex;
  /* white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => (props.lite ? "200px" : "none")};
`;
const FlexNoWrap = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff80;
`;

const Success = styled.div`
  padding-left: 10px;
  color: ${(props) => props?.theme?.success};
`;

const ActionIcon = styled.img`
  height: 23px;
  margin-right: 15px;
  @media only screen and (max-width: 700px) {
    height: 17px;
    margin-right: 5px;
  }
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 105px;
  background-color: ${(props) =>
    statusStyles[props.status]?.backgroundLabel || "transparent"};
  color: ${(props) => statusStyles[props.status]?.colorLabel || "#fff"};
  padding: 2px 7px;
  border-radius: 5px;
`;
const TableRow = styled.tr``;

export const Details = styled.button`
  background: rgba(168, 154, 255, 0.1);
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
    content: "";
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
`;

const Row = styled(TableRow)`
  background-color: ${(props) =>
    statusStyles[props.status]?.backgroundColor || "transparent"};
  &:hover {
    ${Details} {
      background: ${(props) => props.theme.main};
    }
  }
`;

const Linked = styled(Link)`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

function TableCell({ children, align, lite, ...props }) {
  return (
    <Td {...props} align={align} lite={lite}>
      <Content align={align}>{children}</Content>
    </Td>
  );
}

const Td = styled.td`
  padding: 10px 5px;
  color: ${(props) => props.theme.textWhite};
  width: ${(props) => (props.lite ? "200px" : "none")};

  vertical-align: middle;
  font-size: 15px;
  text-align: ${(props) => props.align};
  @media only screen and (max-width: 700px) {
    padding: 20px 10px;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.align === "center" ? "center" : "flex-start"};
`;

const StatusContainer = styled.span`
  display: flex;
  align-items: center;
  color: ${({ status }) => statusStyles[status]?.color};
  font-family: "DMSansBold";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.75px;
`;

const StatusText = styled.span`
  margin-right: 3px;
  text-transform: capitalize;
`;

const Logo = styled.img`
  width: 15px;
  object-fit: scale-down;
  margin-left: 3px;
`;

const Status = ({ status, width, text = "" }) => {
  const medium = 700;
  return (
    <StatusContainer status={status}>
      {width && width >= medium && (
        <StatusText>{text ? text : status}</StatusText>
      )}
    </StatusContainer>
  );
};

export default LogsItem;

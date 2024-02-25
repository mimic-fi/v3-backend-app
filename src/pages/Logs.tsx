// @ts-nocheck

import React, { useState, useRef, useEffect, FC } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useLogs from "../hooks/useLogs";
import { CHAIN_INFO, SupportedChainIdValue } from "../constants/chainInfo";
import { ContainerTable } from "../utils/styles";
import Select from "react-select";
import LogsItem from "../components/LogItem";
import { shortenAddress } from "../utils/web3-utils";
import useEnviromenmentList from "../hooks/useEnviromenmentList";

interface LogsProps {}

interface Filter {
  token?: string;
  status?: string;
  executionPlanId?: string;
  chainId?: SupportedChainIdValue | number;
}

interface TaskStatus {
  type: string; // Assuming type is a string, adjust as necessary
}

interface Task {
  executionType?: string; // The question mark denotes that the property might be undefined
  name: string;
}

interface ItemTask {
  id: string;
  task?: Task;
  status?: TaskStatus;
  executedAt?: number; // Assuming executedAt is a unix timestamp (number)
  chainId?: SupportedChainIdValue;
  planId?: string;
  index?: number; // Assuming index is a number, adjust as necessary
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (newPage: number) => void; // Function that takes a new page number
}

const defaultStatus = [
  "success",
  "reverted",
  "simulatedOk",
  "simulatedFail",
  "executionDelayed",
  "failed",
];

const Logs: FC<LogsProps> = () => {
  const params = useParams<{ id: string }>(); // Specify the type of useParams
  const buttonRef = useRef<HTMLSelectElement>(null);
  const defaultChain: SupportedChainIdValue = 1;
  const [selectedNetwork, setSelectedNetwork] =
    useState<SupportedChainIdValue>(defaultChain);
  const [selectedStatus, setSelectedStatus] = useState<string>(defaultStatus);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [selectedColored, setSelectedColored] = useState<boolean>(true);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openTab, setOpenTab] = useState<string>("");

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [intervalMs, setIntervalMs] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter>({});
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isRefetching } = useLogs(
    params.id,
    page,
    70,
    filters,
    intervalMs ? 5000 : 0
  );
  const { data: envData } = useEnviromenmentList(params.id);
  const navigate = useNavigate();
  const location = useLocation();

  const updateURL = (newFilters) => {
    const searchParams = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // Correctly handle array values
          value.forEach((v) => {
            searchParams.append(`${key}[]`, String(v)); // Use append for arrays
          });
        } else {
          // Handle non-array values
          searchParams.set(key, String(value)); // Convert numbers/booleans to strings
        }
      } else {
        // Remove the parameter if the value is undefined
        searchParams.delete(key);
      }
    });

    // For React Router v6
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  // If colored and realtime are booleans but represented as strings in URLSearchParams:
  const convertToBoolean = (value: string | null): boolean => value === "true";

  // Adjust your useEffect hook like so:
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token") || "";
    // Ensure chainId is of the correct type, especially if it's not a string:
    const chainIdString = searchParams.get("chainId");
    const chainId = chainIdString ? Number(chainIdString) : selectedNetwork; // Convert to number
    const statusValues =
      searchParams.getAll("status[]").length > 0
        ? searchParams.getAll("status[]")
        : defaultStatus;
    const realtimeString = searchParams.get("realtime");
    const coloredString = searchParams.get("colored") || true;
    const executionPlanId = searchParams.get("executionPlanId") || "";
    // Assuming setSelectedNetwork and others correctly handle their types:
    setSelectedNetwork(chainId);
    setSelectedToken(token);
    setSelectedStatus(statusValues);
    setFilters({ token, status: statusValues, executionPlanId, chainId });
    setSelectedColored(coloredString); // Convert to boolean
    setIntervalMs(convertToBoolean(realtimeString)); // Convert to boolean
    setSelectedPlanId(executionPlanId);
    // Call API or other actions needed with the filters
    updateURL({ token, status: statusValues, executionPlanId, chainId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRealTimeChange = () => {
    setIntervalMs(!intervalMs);
    updateURL({ ...filters, colored: selectedColored, realtime: !intervalMs });
  };

  const handleColored = () => {
    setSelectedColored(!selectedColored);
    updateURL({ ...filters, realtime: intervalMs, colored: !selectedColored });
  };

  const handleSelectMultiStatus = (e) => {
    const statuses = e?.map((s) => s.value);
    setSelectedStatus(statuses);
    setPage(1);
    if (e) {
      setFilters({ ...filters, status: statuses });
      updateURL({ ...filters, status: statuses });
    } else {
      const { status, ...otherFilters } = filters;
      setFilters({ ...otherFilters });
      updateURL({ ...otherFilters });
    }
  };

  const handleSelectToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTokenValue = e.target.value;
    setSelectedToken(newTokenValue);
    setPage(1);

    if (newTokenValue !== "") {
      setFilters({ ...filters, token: newTokenValue });
      updateURL({ ...filters, token: newTokenValue });
    } else {
      // Remove the token filter when the value is empty
      const { token, ...otherFilters } = filters;
      setFilters({ ...otherFilters });
      updateURL({ ...otherFilters });
    }
  };

  const handleSelectPlanId = (newPlanId: string) => {
    setSelectedPlanId(newPlanId);
    setSelectedStatus(""); //remove status
    setPage(1);
    setTimeout(() => {
      if (newPlanId !== "") {
        setFilters({ ...filters, executionPlanId: newPlanId });
        updateURL({ ...filters, executionPlanId: newPlanId });
      } else {
        // Remove the token filter when the value is empty
        const { executionPlanId, ...otherFilters } = filters;
        setFilters({ ...otherFilters });
        updateURL({ ...otherFilters });
      }
    }, 500);
  };

  const handleReset = () => {
    setSelectedToken("");
    setSelectedPlanId("");
    setSelectedStatus(defaultStatus);
    setPage(1);
    const { executionPlanId, ...otherFilters } = filters;
    setFilters({ ...otherFilters });
    updateURL({ ...otherFilters });
  };

  const handleMultiNetwork = (networks) => {
    const chainId = networks.map((n) => n.value);
    console.log("adding networks", chainId);
    setSelectedNetwork(chainId);
    setPage(1);
    if (chainId) {
      setFilters({ ...filters, chainId: chainId });
    } else {
      const { chainId, ...otherFilters } = filters;
      setFilters({ ...otherFilters });
    }
  };
  const value = Object.values(CHAIN_INFO).map((c) => {
    return { value: c.value, label: c.name };
  });

  const handleTab = (index) => {
    setOpenMenu(!openMenu);
    setOpenTab(index);
  };

  const statusList = [
    { value: "success", label: "success" },
    { value: "reverted", label: "reverted" },
    { value: "notSimulated", label: "notSimulated" },
    { value: "simulatedOk", label: "simulatedOk" },
    { value: "simulatedFail", label: "simulatedFail" },
    { value: "executionDelayed", label: "executionDelayed" },
    { value: "failed", label: "failed" },
    { value: "notExecuted", label: "notExecuted" },
  ];

  const showOptions = (list) => {
    if (!list) return [];
    return list.map((o) => ({ value: o, label: o }));
  };

  return (
    <div>
      <Tab>{envData?.namespace || params.id}</Tab>
      <Section>
        <FlexMenu>
          <Details
            selected={openTab === "networkFilter" && openMenu}
            onClick={() => handleTab("networkFilter")}
          >
            <Flex>
              Networks{" "}
              <NetworkCount>{selectedNetwork?.length || 0}</NetworkCount>
            </Flex>
          </Details>
          <Details
            selected={openTab === "taskFilter" && openMenu}
            onClick={() => handleTab("taskFilter")}
          >
            <Flex>
              Status <NetworkCount>{selectedStatus?.length}</NetworkCount>
            </Flex>
          </Details>
          <Details
            selected={openTab === "tokenFilter" && openMenu}
            onClick={() => handleTab("tokenFilter")}
          >
            <Flex>
              Token{" "}
              {selectedToken ? (
                <SwitchText>{shortenAddress(selectedToken)}</SwitchText>
              ) : null}
            </Flex>
          </Details>
          <Details
            selected={openTab === "planFilter" && openMenu}
            onClick={() => handleTab("planFilter")}
          >
            <Flex>
              PlanId{" "}
              {selectedPlanId ? (
                <SwitchText>{shortenAddress(selectedPlanId)}</SwitchText>
              ) : null}
            </Flex>
          </Details>
          <Details onClick={() => handleReset()}>Reset</Details>
          <Details onClick={handleColored}>
            <Flex>
              Colored{" "}
              <Switch mode={selectedColored}>
                {selectedColored ? "ON" : "OFF"}
              </Switch>
            </Flex>
          </Details>

          <Details onClick={handleRealTimeChange}>
            <Flex>
              Real Time{" "}
              <Switch mode={intervalMs}>{intervalMs ? "ON" : "OFF"}</Switch>
            </Flex>
          </Details>
          {(isRefetching || isLoading) && <Loader />}
        </FlexMenu>
        <ExpandableComponent isOpen={openMenu}>
          <FilterContainer>
            {openTab === "networkFilter" && (
              <StyledSelect
                classNamePrefix="Select"
                isMulti
                onChange={handleMultiNetwork}
                options={value}
              />
            )}
            {openTab === "taskFilter" && (
              <StyledSelect
                classNamePrefix="Select"
                isMulti
                value={showOptions(selectedStatus)}
                onChange={handleSelectMultiStatus}
                options={statusList}
              />
            )}
            {openTab === "tokenFilter" && (
              <input
                value={selectedToken}
                placeholder="Token Address"
                onChange={handleSelectToken}
                className="custom-select"
              />
            )}
            {openTab === "planFilter" && (
              <input
                value={selectedPlanId}
                placeholder="Plan Id"
                onChange={(e) => handleSelectPlanId(e.target.value)}
                className="custom-plan"
              />
            )}
          </FilterContainer>
        </ExpandableComponent>
        {isLoading ? (
          <></>
        ) : data ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Network</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>PlanId #i</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((task: ItemTask, i: number) => (
                  <LogsItem
                    key={i}
                    item={task}
                    index={i + 1}
                    width={1200}
                    colored={selectedColored}
                    handleSelectPlanId={handleSelectPlanId}
                  />
                ))}
              </tbody>
            </Table>
            <PaginationControls
              currentPage={page}
              totalPages={data?.pages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <>ups...</>
        )}
      </Section>
    </div>
  );
};

const ExpandableComponent = ({ isOpen, children }) => {
  return (
    <>
      <ExpandableContent expanded={isOpen}>{children}</ExpandableContent>
    </>
  );
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </PaginationButton>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationButton>
    </Pagination>
  );
};

const ExpandableContent = styled.div`
  max-height: ${(props) => (props.expanded ? "100%" : "0")};
  margin-bottom: ${(props) => (props.expanded ? "50px" : "0")};
  display: ${(props) => (props.expanded ? "flex" : "none")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  width: 100%;
  padding-top: 50px;
`;

const Table = styled(ContainerTable)`
  width: 100%;
`;

const StyledSelect = styled(Select)`
  .Select__control {
    min-width: 300px;
    border-radius: 10px;
    color: #3c3d3e;
    cursor: pointer;
  }
  /* 
  .Select__control:hover {
    border-color: #a1a1a1;
  }

  .Select__control--is-focused {
    box-shadow: 0 0 0 1px black;
    outline: none;
  }

  .Select__indicator-separator {
    display: none;
  } */

  .Select__menu {
    color: #3c3d3e;
  }
`;

const Section = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;

const FilterContainer = styled.div`
  position: absolute;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 874px;
  max-width: 90%;
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

const NetworkCount = styled.div`
  background-color: #a89aff85;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  margin-left: 10px;
  border-radius: 50%;
  font-weight: 200;
  font-size: 12px;
`;

const FlexMenu = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0px auto;
  min-width: 874px;
  max-width: 100%;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Pagination = styled.div`
  margin-top: 40px;
  span {
    margin: 0 20px;
  }
`;

const PaginationButton = styled.button`
  background: rgba(168, 154, 255, 0.1);
  color: white;
  border: 0px;
  padding: 5px 15px;
  border-radius: 10px;
  cursor: pointer;
  &:disabled {
    background: rgba(239, 239, 239, 0.3);
    color: rgba(16, 16, 16, 0.3);
  }
`;

const Loader = styled.span`
  width: 30px;
  height: 45px;
  display: inline-block;
  position: relative;

  &::after,
  &::before {
    content: "";
    box-sizing: border-box;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #6f5ce6;
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  &::after {
    animation-delay: 1s;
  }

  @keyframes animloader {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

export const Details = styled.button`
  display: flex;
  justify-items: center;
  align-items: center;
  background: ${(props) =>
    !props.selected ? " rgba(168, 154, 255, 0.10)" : "#6F5CE6"};
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

export const Tab = styled.div`
  width: 100%;
  background: #6f5ce6;
  padding: 0;
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  height: 40px;
  button {
    margin-top: 0 !important;
    border-radius: 0 !important;
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

export default Logs;

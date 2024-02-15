import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TokenList from './TokenList';
import TokenRegistryForm from '../components/TokenRegistryForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, LittleButton, Filter, Filters } from '../utils/styles';
import { refresh } from '../utils/web3-utils';
import { Tab } from '../utils/styles';

function Tabs() {
  const [activeTab, setActiveTab] = useState('tokens');


  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Tab>
        <button
          onClick={() => handleTabClick('tokens')}
          className={activeTab === 'tokens' ? 'active' : ''}
        >
          Tokens
        </button>
        <button
          onClick={() => handleTabClick('list')}
          className={activeTab === 'list' ? 'active' : ''}
        >
          List
        </button>
      </Tab>
      <div>
        {activeTab === 'tokens' && <TokenRegistry />}
        {activeTab === 'list' && <TokenList /> }
      </div>
    </div>
  );
}

interface TokenRegistryData {
  _id: string;
  address: string;
  chainId: number;
  decimals: number;
  isNativeToken: boolean;
  isERC20: boolean;
  isWrappedNativeToken: boolean;
  name: string;
  symbol: string;
}

const URL = process.env.REACT_APP_SERVER_BASE_URL;

const TokenRegistry: React.FC = () => {
  const [symbolFilter, setSymbolFilter] = useState<string>('');
  const [addressFilter, setAddressFilter] = useState<string>('');
  const [isNativeFilter, setIsNativeFilter] = useState<boolean | null>(null);
  const [isERC20Filter, setIsERC20Filter] = useState<boolean | null>(null);
  const [isWrappedNativeFilter, setIsWrappedNativeFilter] = useState<boolean | null>(null);

  const [tokenRegistryData, setTokenRegistry] = useState<TokenRegistryData[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [erc20ModalOpen, setERC20ModalOpen] = useState(false);
  const [erc20Params, setERC20] = useState<any>('');
  const [deleteParams, setDeleteParams] = useState<any>('');

  const fetchTokenRegistry = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ data: TokenRegistryData[]; pages: number; total: number }>(
        `${URL}/token-registry/tokens`,
        {
          params: {
            limit: 20,
            page,
            ...(symbolFilter !== '' && { symbol: symbolFilter }),
            ...(addressFilter !== '' && { addresses: [addressFilter] }),
            isNativeToken: isNativeFilter,
            isWrappedNativeToken: isWrappedNativeFilter,
            isERC20: isERC20Filter,
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setTokenRegistry(response?.data?.data);
      setTotalPages(response?.data?.pages);
      setTotalItems(response?.data?.total);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await fetchTokenRegistry(page);
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchTokenRegistry(1);
  }, [symbolFilter, addressFilter, isNativeFilter, isERC20Filter, isWrappedNativeFilter]);

  const handleSymbolFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbolFilter(event.target.value);
  };

  const handleAddressFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFilter(event.target.value);
  };

  const handleIsNativeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setIsNativeFilter(value === 'yes' ? true : value === 'no' ? false : null);
  };

  const handleIsERC20FilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setIsERC20Filter(value === 'yes' ? true : value === 'no' ? false : null);
  };

  const handleIsWrappedNativeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setIsWrappedNativeFilter(value === 'yes' ? true : value === 'no' ? false : null);
  };



  const handleDeleteClick = (item: any) => {
    setDeleteParams(item);
    setCustomModalOpen(true);
  };

  const handleERC20 = (item: any) => {
    setERC20(item);
    setERC20ModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const item = deleteParams;
    const token = localStorage.getItem('token');
    const url = `${URL}/token-registry/tokens/${item.chainId}/${item.address}`;

    try {
      await axios.delete(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });
      console.log('Token registry item successfully deleted');
      fetchTokenRegistry(currentPage);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleConfirmDelete();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }
      console.error('There was an error deleting the token list item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleUpdateToken = async () => {
    const updatedItem = {
      ...erc20Params,
      isERC20: !erc20Params.isERC20,
    };

    const token = localStorage.getItem('token');
    const url = `${URL}/token-registry/tokens`;

    try {
      await axios.put(url, updatedItem, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`,
        },
      });

      console.log('Token registry item successfully updated');
      fetchTokenRegistry(currentPage);

    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await refresh();
          await handleUpdateToken();
        } catch (refreshError) {
          console.error(`Error: Unable to refresh token. Please log in again.`);
        }
      }

      console.error('There was an error updating the token list item:', error);
    }
    setERC20ModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };
  const handleCancelERC20 = () => {
    setERC20ModalOpen(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchTokenRegistry(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchTokenRegistry(currentPage - 1);
    }
  };

  return (
    <TokenRegistrySection>
      <TokenRegistryForm onSuccess={() => fetchTokenRegistry(1)} />
      <Filters>
        <Filter>
          <label>Symbol</label>
          <input type="text" placeholder="Filter by Symbol" value={symbolFilter} onChange={handleSymbolFilterChange} />
        </Filter>
        <Filter>
          <label>Address</label>
          <input type="text" placeholder="Filter by Address" value={addressFilter} onChange={handleAddressFilterChange} />
        </Filter>
        <Filter>
          <label>Native</label>
          <select value={isNativeFilter === null ? 'all' : isNativeFilter ? 'yes' : 'no'} onChange={handleIsNativeFilterChange}>
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Filter>
        <Filter>
          <label>ERC20</label>
          <select value={isERC20Filter === null ? 'all' : isERC20Filter ? 'yes' : 'no'} onChange={handleIsERC20FilterChange}>
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Filter>
        <Filter>
          <label>Wrapped</label>
          <select value={isWrappedNativeFilter === null ? 'all' : isWrappedNativeFilter ? 'yes' : 'no'} onChange={handleIsWrappedNativeFilterChange}>
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Filter>
      </Filters>
      {tokenRegistryData ? (
        <>
          <Table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Symbol</th>
                <th>Name</th>
                <th>Network</th>
                <th>Decimals</th>
                <th>ERC20</th>
                <th>Native</th>
                <th>Wrapped</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.values(tokenRegistryData).map((item, index) => (
                <tr key={index}>
                  <td>{item.address}</td>
                  <td>{item.symbol}</td>
                  <td>{item.name}</td>
                  <td>{item.chainId}</td>
                  <td>{item.decimals}</td>
                  <td className="pointer" onClick={() => handleERC20(item)}>{item.isERC20 ? '✅' : '❌'}</td>
                  <td>{item.isNativeToken ? '✅' : '❌'}</td>
                  <td>{item.isWrappedNativeToken ? '✅' : '❌'}</td>
                  <td>
                    <img onClick={() => handleDeleteClick(item)} src={deleteIcon} alt="Eliminar" />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <LittleButton onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </LittleButton>
            <p>
              Page {currentPage} of {totalPages}, Total Items: {totalItems}
            </p>
            <LittleButton onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </LittleButton>
          </Pagination>
          {customModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to delete this token list item?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
          {erc20ModalOpen && (
            <CustomConfirmationModal
              message="Are you sure you want to change ERC20 value on this item?"
              onConfirm={handleUpdateToken}
              onCancel={handleCancelERC20}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </TokenRegistrySection>
  );
};

const Table = styled(ContainerTable)``;

const TokenRegistrySection = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 874px;
  max-width: 90%;
`;


const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  button {
    margin-top: 0;
  }
  p {
    margin: 0 20px;
  }
`;

export default Tabs;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TokenRegistryForm from '../components/TokenRegistryForm';
import CustomConfirmationModal from '../components/CustomConfirmationModal';
import deleteIcon from '../assets/delete.png';
import { toast } from 'react-toastify';
import { ContainerTable, LittleButton } from '../utils/styles';
import { logout } from '../utils/web3-utils';

interface TokenRegistrySetting {
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

const TokenRegistrySettings: React.FC = () => {
  const [symbolFilter, setSymbolFilter] = useState<string>('');
  const [addressFilter, setAddressFilter] = useState<string>('');
  const [isNativeFilter, setIsNativeFilter] = useState<boolean | null>(null);
  const [isWrappedNativeFilter, setIsWrappedNativeFilter] = useState<boolean | null>(null);

  const [tokenRegistrySettings, setTokenRegistrySettings] = useState<TokenRegistrySetting[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState<any>('');

  const fetchTokenRegistrySettings = async (page: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ data: TokenRegistrySetting[]; pages: number; total: number }>(
        `${URL}/token-registry/tokens`,
        {
          params: {
            limit: 20,
            page,
            symbol: symbolFilter,
            address: addressFilter,
            isNativeToken: isNativeFilter,
            isWrappedNativeToken: isWrappedNativeFilter,
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'x-auth-token': `${token}`,
          },
        }
      );

      setTokenRegistrySettings(response?.data?.data);
      setTotalPages(response?.data?.pages);
      setTotalItems(response?.data?.total);
    } catch (error: any) {
      if (error.response.status === 401) {
        logout();
      }
      console.error('Token list error:', error);
    }
  };

  useEffect(() => {
    fetchTokenRegistrySettings(1);
  }, [symbolFilter, addressFilter, isNativeFilter, isWrappedNativeFilter]);

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

  const handleIsWrappedNativeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setIsWrappedNativeFilter(value === 'yes' ? true : value === 'no' ? false : null);
  };

  const handleDeleteClick = (item: any) => {
    setDeleteParams(item);
    setCustomModalOpen(true);
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

      fetchTokenRegistrySettings(currentPage);
      toast.success('Token registry item successfully deleted');
    } catch (error: any) {
      if (error.response.status === 401) {
        logout();
      }
      console.error('There was an error deleting the token list item:', error);
    }

    setCustomModalOpen(false);
  };

  const handleCancelDelete = () => {
    setCustomModalOpen(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchTokenRegistrySettings(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchTokenRegistrySettings(currentPage - 1);
    }
  };

  return (
    <TokenRegistrySection>
      <h2>Token Registry Settings:</h2>
      <TokenRegistryForm onSuccess={() => fetchTokenRegistrySettings(1)} />
      <Filters>
        <Filter>
          <label>Symbol:</label>
          <input type="text" placeholder="Filter by Symbol" value={symbolFilter} onChange={handleSymbolFilterChange} />
        </Filter>
        <Filter>
          <label>Address:</label>
          <input type="text" placeholder="Filter by Address" value={addressFilter} onChange={handleAddressFilterChange} />
        </Filter>
        <Filter>
          <label>Native:</label>
          <select value={isNativeFilter === null ? 'all' : isNativeFilter ? 'yes' : 'no'} onChange={handleIsNativeFilterChange}>
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Filter>
        <Filter>
          <label>Wrapped:</label>
          <select value={isWrappedNativeFilter === null ? 'all' : isWrappedNativeFilter ? 'yes' : 'no'} onChange={handleIsWrappedNativeFilterChange}>
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Filter>
      </Filters>
      {tokenRegistrySettings ? (
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
              {Object.values(tokenRegistrySettings).map((item, index) => (
                <tr key={index}>
                  <td>{item.address}</td>
                  <td>{item.symbol}</td>
                  <td>{item.name}</td>
                  <td>{item.chainId}</td>
                  <td>{item.decimals}</td>
                  <td>{item.isERC20 ? '✅' : '❌'}</td>
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

const Filters = styled.div`
  display: flex;
  margin-top: 70px;
`;

const Filter = styled.div`
  margin-right: 20px;

  label {
    margin-right: 5px;
  }

  select,
  input {
    padding: 5px;
  }
  select {
    display: block;
    height: 50px;
    border-radius: 7px;
  }
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

export default TokenRegistrySettings;

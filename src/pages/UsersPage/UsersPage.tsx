import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Column } from 'react-table';
import { format } from 'date-fns';
import ReactPaginate from 'react-paginate';
import Chip from '@mui/material/Chip';

import {
  deleteUserById,
  getAllUsersWithSort,
  getUserById,
  searchUsers,
} from '../../services/user.service';
import { TableComponent, TableHeader } from '../../components';
import AddUserModal from './AddUserModal/AddUserModal';
import { useLanguage } from '../../context/LanguageContext';

import styles from './UsersPage.module.css';

import plusIcon from '../../assets/users-page/plus.svg';
import editIcon from '../../assets/users-page/edit.svg';
import deleteIcon from '../../assets/users-page/delete.svg';
import officeIcon from '../../assets/users-page/office-building.svg';
import userIcon from '../../assets/users-page/user.svg';
import searchIcon from '../../assets/users-page/search.svg';
import arrowDownIcon from '../../assets/users-page/errowDown.svg';
import clearIcon from '../../assets/users-page/x-circle.svg';
import left from '../../assets/users-page/left.svg';
import right from '../../assets/users-page/right.svg';

type User = {
  address_line1: string;
  city: string;
  country: string;
  current_plan: null | number;
  email: string;
  first_name: string;
  id: number;
  joined: string;
  last_login: string;
  last_name: string;
  role: string;
  zip_code: number;
  company?: string;
};

type Row = {
  Type: string;
  LastLogin: string;
  Name: string;
  Joined: string;
  LastActive: string;
  Company: string;
  id: number;
};

type ColumnWithCustomHeader = Column<Row> & {
  customHeader: React.ReactNode;
};

const UsersPage = () => {
  const { t } = useLanguage();

  const typePopUpRef = useRef<HTMLDivElement | null>(null);

  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeOfMethod, setTypeOfMethod] = useState<string | null>(null);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userByIdLoading, setUserByIdLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [resultsFound, setResultsFound] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [userById, setUserById] = useState<User>();
  const [searchValue, setSearchValue] = useState('');
  const [activeSortQuery, setActiveSortQuery] = useState<{
    key: string;
    sortDirection?: string;
  }>({
    key: 'first_name',
    sortDirection: 'ascending',
  });
  const [sortOptions, setSortOptions] = useState<
    {
      key: string;
      direction: string;
    }[]
  >([
    { key: 'type', direction: 'ascending' },
    { key: 'company', direction: 'ascending' },
    { key: 'joined', direction: 'ascending' },
    { key: 'last_login', direction: 'ascending' },
    { key: 'first_name', direction: 'ascending' },
    { key: 'last_name', direction: 'ascending' },
  ]);

  const usersPerPage = 5;

  const fetchData = useCallback(
    async ({
      key,
      sortDirection,
      sortOption,
    }: {
      key?: string;
      sortDirection?: string;
      sortOption?: string | null;
    }) => {
      setIsLoading(true);
      try {
        const sortParam = sortDirection === 'descending' ? `-${key}` : key;
        const data = await getAllUsersWithSort(sortParam, sortOption);
        setUsers(data);
        setIsLoading(false);
        setResultsFound(true);
      } catch (error) {
        console.error(error, 'error');
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(activeSortQuery);
  }, [fetchData, activeSortQuery]);

  useEffect(() => {
    fetchData({
      sortOption: typeOfMethod,
    });
  }, [typeOfMethod, fetchData]);

  const handleEdit = async (id: number | string) => {
    setUserByIdLoading(true);
    setOpenEditModal(true);
    const user = await getUserById(id);
    if (user.id) {
      setUserById(user);
      setUserByIdLoading(false);
    } else {
      setUserByIdLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    const data = await deleteUserById(id);
    if (data?.status === 204) {
      fetchData(activeSortQuery);
    } else {
      // setIsDeleteLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const searchedArray = await searchUsers(searchValue);
    if (searchedArray.length) {
      setIsLoading(false);
      setUsers(searchedArray);
      setResultsFound(true);
    } else {
      setIsLoading(false);
      setResultsFound(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchValue('');
    fetchData(activeSortQuery);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    fetchData(activeSortQuery);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    fetchData(activeSortQuery);
  };

  const toggleDropdown = useCallback(() => {
    setIsMethodDropdownOpen((prev) => !prev);
  }, []);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const sortData = (key: string) => {
    const updatedSortOptions = sortOptions.map((option) => {
      if (option.key === key) {
        const direction =
          option.direction === 'ascending' ? 'descending' : 'ascending';
        // setActiveSortKey(key);
        return { ...option, direction };
      } else {
        return { ...option, direction: 'ascending' };
      }
    });

    setSortOptions(updatedSortOptions);

    const sortDirection = updatedSortOptions.find(
      (option) => option.key === key
    )?.direction;
    setActiveSortQuery({ key, sortDirection });
  };

  useEffect(() => {
    const methods = users.map((invoice) => invoice.role);
    const uniqueMethods = [...new Set(methods)];
    setUniqueTypes(uniqueMethods);
  }, [users]);

  const handleClickOutsideStatuses = (event: MouseEvent) => {
    if (
      typePopUpRef.current &&
      !typePopUpRef.current.contains(event.target as Node)
    ) {
      setIsMethodDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideStatuses);

    return () => {
      document.removeEventListener('click', handleClickOutsideStatuses);
    };
  }, []);

  const columns = [
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('type')}
        >
          <p>{t('Type')}</p>
          {sortOptions.find((option) => option.key === 'type')?.direction ===
          'ascending' ? (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          )}
        </div>
      ),
      accessor: 'role',
      width: 60,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('last_login')}
        >
          <p>{t('Last_Login')}</p>
          {sortOptions.find((option) => option.key === 'last_login')
            ?.direction === 'ascending' ? (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          )}
        </div>
      ),
      accessor: 'last_login',
      width: 70,
      Cell: ({ value }: { value: string }) => (
        <div>{format(new Date(value), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('first_name')}
        >
          <p>{t('Name')}</p>
          {sortOptions.find((option) => option.key === 'first_name')
            ?.direction === 'ascending' ? (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          )}
        </div>
      ),
      accessor: 'first_name',
      width: 100,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('joined')}
        >
          <p>{t('Joined')}</p>
          {sortOptions.find((option) => option.key === 'joined')?.direction ===
          'ascending' ? (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          )}
        </div>
      ),
      accessor: 'joined',
      width: 70,
      Cell: ({ value }: { value: string }) => (
        <div>{format(new Date(value), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <p>{t('Last_Active')}</p>
        </div>
      ),
      accessor: 'LastActive',
      width: 80,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('company')}
        >
          <p>{t('Company')}</p>
          {sortOptions.find((option) => option.key === 'company')?.direction ===
          'ascending' ? (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <img
              src={arrowDownIcon}
              alt='sort'
              style={{
                marginLeft: '5px',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          )}
        </div>
      ),
      accessor: 'company',
      width: 120,
    },
    {
      Header: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>{t('Action')}</p>
        </div>
      ),
      accessor: 'id',
      width: 175,
      Cell: ({ row }: { row: any }) => (
        <div className={styles.btnWrapper}>
          <div
            className={styles.imageWrapper}
            onClick={() => handleEdit(row.original.id)}
          >
            <img alt='edit' src={editIcon} />
          </div>

          <div
            className={styles.imageWrapper}
            onClick={() => handleDelete(row.original.id)}
          >
            <img alt='delete' src={deleteIcon} />
          </div>
          <button className={styles.btnCreateToken}>generate API key</button>
        </div>
      ),
    },
  ];

  const columnsHeader: ColumnWithCustomHeader[] = [
    {
      Header: 'LeftHeader',
      width: 332,
      customHeader: (
        <div className={styles.filterWrapper}>
          <div
            className={styles.filterBtnWrapper}
            onClick={toggleDropdown}
            ref={typePopUpRef}
          >
            <img src={userIcon} alt='type' />
            <p>{t('Type')}</p>
          </div>
          {isMethodDropdownOpen && (
            <div className={styles.optionWrapper}>
              {uniqueTypes.map((method) => (
                <div
                  key={method}
                  onClick={() => {
                    setTypeOfMethod(method);
                  }}
                  className={styles.optionFilter}
                >
                  {method}
                </div>
              ))}
            </div>
          )}
          {/* <div className={styles.filterBtnWrapper}>
            <img src={officeIcon} alt='Company' />
            <p>{t('Company')}</p>
          </div> */}

          {typeOfMethod && (
            <Chip
              sx={{
                height: '16px',
                fontSize: '7px',
                p: '4px',
                '& .MuiChip-deleteIcon': {
                  width: '12px',
                  height: '12px',
                  fontSize: '10px',
                },
              }}
              label={typeOfMethod.toUpperCase()}
              onDelete={() => setTypeOfMethod(null)}
            />
          )}
        </div>
      ),
    },
    {
      Header: 'RightHeader',
      width: 332,
      customHeader: (
        <div className={styles.searchInputWrapper}>
          <input
            type='text'
            placeholder={t('search')}
            className={styles.inputSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div
            style={{
              display: 'flex',
              padding: '2px 8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '4px',
              background: 'var(--main-main, #556EE6)',
            }}
          >
            <img
              src={searchIcon}
              alt='Search Icon'
              className={styles.searchIcon}
            />
            {searchValue.length ? (
              <img
                src={clearIcon}
                alt='clear'
                className={styles.clearIcon}
                onClick={handleClearSearch}
              />
            ) : (
              ''
            )}
            <button className={styles.btnSearch} onClick={handleSearch}>
              {t('search')}
            </button>
          </div>
        </div>
      ),
    },
  ];

  const indexOfLastUser = (currentPage + 1) * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <p className={styles.pricingTitle}>{t('User')}</p>
        <button className={styles.addUserBtn} onClick={handleOpenModal}>
          <img src={plusIcon} alt='add user' />
          <p>{t('Add_User')}</p>
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <TableHeader columns={columnsHeader} />
        <TableComponent
          resultsFound={resultsFound}
          columns={columns}
          data={currentUsers}
          isLoading={isLoading}
        />
      </div>

      <ReactPaginate
        pageCount={Math.ceil(users?.length / usersPerPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        initialPage={currentPage}
        containerClassName={styles.pagination}
        activeClassName={styles.activePage}
        previousLabel={
          <button className={styles.pagination__prev}>
            <img alt='prev' src={left} />
            {t('prev')}
          </button>
        } // Стилізуйте кнопку "Prev"
        nextLabel={
          <button className={styles.pagination__prev}>
            {t('next')}
            <img alt='next' src={right} />
          </button>
        }
      />

      <AddUserModal
        openModal={openModal}
        handleClose={handleClose}
        handleCloseEditModal={handleCloseEditModal}
        user={userById}
        openEditModal={openEditModal}
        userByIdLoading={userByIdLoading}
      />
    </div>
  );
};

export default UsersPage;

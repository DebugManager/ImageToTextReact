import React, { useState, useEffect, useCallback } from 'react';
import { Column } from 'react-table';
import { format } from 'date-fns';
import ReactPaginate from 'react-paginate';

import { deleteUserById, getAllUsersWithSort, getUserById, searchUsers } from '../../services/user.service';
import { TableComponent, TableHeader } from '../../components';
import AddUserModal from './AddUserModal/AddUserModal';

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
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userByIdLoading, setUserByIdLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [resultsFound, setResultsFound] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [userById, setUserById] = useState<User>();
    const [searchValue, setSearchValue] = useState('');
    const [activeSortQuery, setActiveSortQuery] = useState<{ key: string; sortDirection?: string }>({
        key: 'first_name',
        sortDirection: 'ascending',
    });
    const [sortOptions, setSortOptions] = useState<{
        key: string;
        direction: string;
    }[]>([
        { key: 'role', direction: 'ascending' },
        { key: 'company', direction: 'ascending' },
        { key: 'joined', direction: 'ascending' },
        { key: 'last_login', direction: 'ascending' },
        { key: 'first_name', direction: 'ascending' },
        { key: 'last_name', direction: 'ascending' },
    ]);

    const usersPerPage = 5;

    const fetchData = useCallback(async ({ key, sortDirection }: { key: string; sortDirection?: string }) => {
        setIsLoading(true);
        try {
            const sortParam = sortDirection === 'descending' ? `-${key}` : key;
            const data = await getAllUsersWithSort(sortParam);
            setUsers(data);
            setIsLoading(false);
            setResultsFound(true);
        } catch (error) {
            console.error(error, 'error');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(activeSortQuery);
    }, [fetchData, activeSortQuery]);


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
    }

    const handleDelete = async (id: number | string) => {
        const data = await deleteUserById(id);
        if (data?.status === 204) {
            fetchData(activeSortQuery);
        } else {
            // setIsDeleteLoading(false);
        };
    }

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
    }

    const handleClearSearch = async () => {
        setSearchValue('');
        fetchData(activeSortQuery);
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleClose = () => {
        setOpenModal(false);
        fetchData(activeSortQuery);
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        fetchData(activeSortQuery);
    }

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const sortData = (key: string) => {
        const updatedSortOptions = sortOptions.map(option => {
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

        const sortDirection = updatedSortOptions.find(option => option.key === key)?.direction;
        setActiveSortQuery({ key, sortDirection });
    };


    const columns = [
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => sortData('role')}
                >
                    <p>Type</p>
                    {sortOptions.find(option => option.key === 'role')?.direction === 'ascending' ? (
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
                    <p>Last Login</p>
                    {sortOptions.find(option => option.key === 'last_login')?.direction === 'ascending' ? (
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
                <div>
                    {format(new Date(value), 'yyyy-MM-dd')}
                </div>
            ),
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => sortData('first_name')}
                >
                    <p>Name</p>
                    {sortOptions.find(option => option.key === 'first_name')?.direction === 'ascending' ? (
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
                    <p>Joined</p>
                    {sortOptions.find(option => option.key === 'joined')?.direction === 'ascending' ? (
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
                <div>
                    {format(new Date(value), 'yyyy-MM-dd')}
                </div>
            ),
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <p>Last Active</p>
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
                    <p>Company</p>
                    {sortOptions.find(option => option.key === 'company')?.direction === 'ascending' ? (
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
                    <p>Action</p>
                </div>
            ),
            accessor: 'id',
            width: 175,
            Cell: ({ row }: { row: any }) => (
                <div className={styles.btnWrapper}>
                    <div className={styles.imageWrapper} onClick={() => handleEdit(row.original.id)}>
                        <img alt='edit' src={editIcon} />
                    </div>

                    <div className={styles.imageWrapper} onClick={() => handleDelete(row.original.id)}>
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
                    <div className={styles.filterBtnWrapper}>
                        <img src={userIcon} alt='type' />
                        <p>Type</p>
                    </div>
                    <div className={styles.filterBtnWrapper}>
                        <img src={officeIcon} alt='Company' />
                        <p>Company</p>
                    </div>
                </div>
            ),
        },
        {
            Header: 'RightHeader',
            width: 332,
            customHeader: (
                <div className={styles.searchInputWrapper}>
                    <input
                        type="text"
                        placeholder="Search"
                        className={styles.inputSearch}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <div style={{
                        display: 'flex',
                        padding: '2px 8px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        background: 'var(--main-main, #556EE6)',
                    }}>
                        <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
                        {searchValue.length ? <img src={clearIcon} alt='clear' className={styles.clearIcon} onClick={handleClearSearch} /> : ''}
                        <button className={styles.btnSearch} onClick={handleSearch}>Search</button>
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
                <p className={styles.pricingTitle}>User</p>
                <button className={styles.addUserBtn} onClick={handleOpenModal}>
                    <img src={plusIcon} alt="add user" />
                    <p>add user</p>
                </button>
            </div>
            <div className={styles.tableWrapper}>
                <TableHeader columns={columnsHeader} />
                <TableComponent resultsFound={resultsFound} columns={columns} data={currentUsers} isLoading={isLoading} />
            </div>

            <ReactPaginate
                pageCount={Math.ceil(users?.length / usersPerPage)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                initialPage={currentPage}
                containerClassName={styles.pagination}
                activeClassName={styles.activePage}
                previousLabel={<button className={styles.pagination__prev}><img alt='prev' src={left} />Prev</button>} // Стилізуйте кнопку "Prev"
                nextLabel={<button className={styles.pagination__prev}>Next<img alt='next' src={right} /></button>}
            />

            <AddUserModal openModal={openModal} handleClose={handleClose} handleCloseEditModal={handleCloseEditModal} user={userById} openEditModal={openEditModal} userByIdLoading={userByIdLoading} />
        </div>
    );
};

export default UsersPage;

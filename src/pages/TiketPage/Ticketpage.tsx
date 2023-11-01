import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Column } from 'react-table';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { TableComponent, TableHeader } from '../../components';
import { closeTicket, getAllTickets, searchCTickets } from '../../services/ticket.service';
import { TicketModal } from './TicketModal/TicketModal';
import { getUser } from '../../services/locastorage.service';
import { CircleLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

import styles from './TicketPage.module.css';

import reply from '../../assets/ticket/reply.svg';
import plusIcon from '../../assets/users-page/plus.svg';
import searchIcon from '../../assets/users-page/search.svg';
import clearIcon from '../../assets/users-page/x-circle.svg';
import arrowDownIcon from '../../assets/users-page/errowDown.svg';
import left from '../../assets/users-page/left.svg';
import right from '../../assets/users-page/right.svg';


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

interface ITicket {
    id: number;
    subject: string;
    description?: string;
    created: string;
    status: string;
    user_id: number;
}

const myCustomStyles = {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
};

const progressBarStyles = {
    background: '#556EE6',
};

const CustomCheckmark = () => (
    <div style={{ color: '#556EE6' }}>✔</div>
);

const CustomErrorIcon = () => (
    <div style={{ color: 'red' }}>✘</div>
);

const ticketsPerPage = 5;

const Ticketpage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultsFound, setResultsFound] = useState(true);
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [currentUser, setCurrentUser] = useState<number | null>(null);
    const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState('');
    const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
    const [activeSortQuery, setActiveSortQuery] = useState<{ key: string; sortDirection?: string }>({
        key: 'id',
        sortDirection: 'ascending',
    });
    const [sortOptions, setSortOptions] = useState<{
        key: string;
        direction: string;
    }[]>([
        { key: 'id', direction: 'ascending' },
        { key: 'subject', direction: 'ascending' },
        { key: 'created', direction: 'ascending' },
        { key: 'status', direction: 'ascending' },
    ]);

    useEffect(() => {
        const user = getUser();
        if (user?.current_plan && user?.id) {
            setCurrentUser(user?.id);
        }
    }, []);

    const fetchData = useCallback(async ({ key, sortDirection }: { key: string; sortDirection?: string }) => {
        setIsLoading(true);
        try {
            const sortParam = sortDirection === 'descending' ? `-${key}` : key;
            const data = await getAllTickets(sortParam);
            setTickets(data);
            setIsLoading(false);
            setResultsFound(true);
        } catch (error) {
            console.error(error, 'error');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(activeSortQuery);
    }, [fetchData, activeSortQuery])


    // const handleReply = (id: number) => {
    //     console.log(id);
    // }

    const handleSearch = async () => {
        setIsLoading(true);
        const searchedArray = await searchCTickets(searchValue);
        if (searchedArray.length) {
            setIsLoading(false);
            setTickets(searchedArray);
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

    const handleCloseModal = () => {
        setOpenRequestModal(false);
        fetchData(activeSortQuery);
    }

    const handleCloseTicket = async (id: number) => {
        setLoadingStates({ ...loadingStates, [id]: true });
        const req = await closeTicket(id);
        if (req?.id) {
            setLoadingStates({ ...loadingStates, [id]: false });
            toast.success('Ticket was closed', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
            fetchData(activeSortQuery);
        } else {
            toast.error('Something goes wrong', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast-error',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomErrorIcon />,
            });
            setLoadingStates({ ...loadingStates, [id]: false });
            fetchData(activeSortQuery);
        }
    }

    const sortData = (key: string) => {
        const updatedSortOptions = sortOptions.map(option => {
            if (option.key === key) {
                const direction =
                    option.direction === 'ascending' ? 'descending' : 'ascending';
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
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => sortData('id')}
                >
                    <p>ID</p>
                    {sortOptions.find(option => option.key === 'id')?.direction === 'ascending' ? (
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
            accessor: 'id',
            width: 45,
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => sortData('subject')}
                >
                    <p>Subject</p>
                    {sortOptions.find(option => option.key === 'subject')?.direction === 'ascending' ? (
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
            accessor: 'subject',
            width: 90,
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => sortData('created')}
                >
                    <p>Created</p>
                    {sortOptions.find(option => option.key === 'created')?.direction === 'ascending' ? (
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
            accessor: 'created',
            width: 90,
            Cell: ({ value }: { value: string }) => (
                <div>
                    {format(new Date(value), 'yyyy-MM-dd')}
                </div>
            ),
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => sortData('lastActive')}
                >
                    <p>Last Active</p>
                    {sortOptions.find(option => option.key === 'lastActive')?.direction === 'ascending' ? (
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
            accessor: 'lastActive',
            width: 80,
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => sortData('status')}
                >
                    <p>Status</p>
                    {sortOptions.find(option => option.key === 'status')?.direction === 'ascending' ? (
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
            accessor: 'status',
            width: 65,
            Cell: ({ value }: { value: string }) => (
                <div className={`${value === 'Pending' ? styles.pending : styles.succes}`}>
                    {value}
                </div>
            ),
        },
        {
            Header: (
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <p>Action</p>
                </div>
            ),
            accessor: 'currentid',
            with: 120,
            Cell: ({ row }: { row: any }) => {
                return (
                    <div className={styles.btnWrapper}>
                        <Link to={`/tickets/${row.original.id}`} className={styles.btnReply}>
                            <img alt='reply' src={reply} />
                            Reply
                        </Link>

                        {loadingStates[row.original.id] ? (
                            <CircleLoader loading={loadingStates[row.original.id]} color={'#556EE6'} size={20} />
                        ) :
                            <div className={styles.closeTicket} onClick={() => handleCloseTicket(row.original.id)}>
                                Close ticket
                            </div>
                        }
                    </div>

                )
            }

        },
    ];

    const columnsHeader: ColumnWithCustomHeader[] = [
        {
            Header: 'LeftHeader',
            width: 230,
            customHeader: (
                <button className={styles.addCompanie} onClick={() => setOpenRequestModal(true)}>
                    <img src={plusIcon} alt='add new companie' />
                    Request New features list
                </button>
            ),
        },
        {
            Header: 'RightHeader',
            width: 230,
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

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    const indexOfLastUser = (currentPage + 1) * ticketsPerPage;
    const indexOfFirstUser = indexOfLastUser - ticketsPerPage;
    const currentCompanies = tickets?.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={styles.wrapper}>

            <div className={styles.tableWrapper}>
                <TableHeader columns={columnsHeader} />
                <TableComponent
                    resultsFound={resultsFound}
                    columns={columns}
                    data={currentCompanies}
                    isLoading={isLoading}
                />


            </div>

            <ReactPaginate
                pageCount={Math.ceil(tickets?.length / ticketsPerPage)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                initialPage={currentPage}
                containerClassName={styles.pagination}
                activeClassName={styles.activePage}
                previousLabel={<button className={styles.pagination__prev}><img alt='prev' src={left} />Prev</button>}
                nextLabel={<button className={styles.pagination__prev}>Next<img alt='next' src={right} /></button>}
            />

            <TicketModal isOpen={openRequestModal} handleClose={handleCloseModal} currentUser={currentUser} />
        </div>
    )
}

export default Ticketpage;

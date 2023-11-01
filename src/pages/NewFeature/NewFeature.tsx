import React, { useCallback, useEffect, useState } from 'react';

import { Column } from 'react-table';
import { toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';

import ReactPaginate from 'react-paginate';

import { TableComponent, TableHeader } from '../../components';

import styles from './NewFeature.module.css';

import left from '../../assets/users-page/left.svg';
import right from '../../assets/users-page/right.svg';
import clearIcon from '../../assets/users-page/x-circle.svg';
import searchIcon from '../../assets/users-page/search.svg';
import plusIcon from '../../assets/users-page/plus.svg';
import arrowDownIcon from '../../assets/users-page/errowDown.svg';
import like from '../../assets/features/like.svg';
import voted from '../../assets/features/voted.svg';
import { getAllFeatures, searchFeatures, setUnVote, setVote } from '../../services/feature.servise';
import { FeaturesModal } from './FeaturesModal/FeaturesModal';
import { getUser } from '../../services/locastorage.service';

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

interface IFeatures {
    id: number;
    name: string;
    votes: number;
    voted_users: number[];
}

const companiesPerPage = 5;

const NewFeature = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultsFound, setResultsFound] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [currentUserID, setCurrentUserID] = useState<null | number>(null);
    const [openFeaturesModal, setOpenFeaturesModal] = useState<boolean>(false);
    const [features, setFeatures] = useState<IFeatures[]>([]);
    const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
    const [activeSortQuery, setActiveSortQuery] = useState<{ key: string; sortDirection?: string }>({
        key: 'name',
        sortDirection: 'ascending',
    });
    const [sortOptions, setSortOptions] = useState<{
        key: string;
        direction: string;
    }[]>([
        { key: 'name', direction: 'ascending' },
        { key: 'votes', direction: 'ascending' },
    ]);

    useEffect(() => {
        const user = getUser();
        if (user) {
            setCurrentUserID(user.id);
        }

    }, []);

    const fetchData = useCallback(async ({ key, sortDirection }: { key: string; sortDirection?: string }) => {
        setIsLoading(true);
        try {
            const sortParam = sortDirection === 'descending' ? `-${key}` : key;
            const data = await getAllFeatures(sortParam);
            setFeatures(data);
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


    const handleVote = async (id: number) => {
        if (currentUserID && id) {
            setLoadingStates({ ...loadingStates, [id]: true });
            const currentFeature = features.find(feature => feature.id === id);

            if (currentFeature) {
                const userVotedIds = currentFeature.voted_users || [];

                if (userVotedIds.includes(currentUserID)) {
                    const unvote = await setUnVote(id, currentUserID);

                    if (unvote.message === 'Vote successfully counted.') {
                        toast.success('You unvoted successfully', {
                            position: 'top-right',
                            autoClose: 3000,
                            className: 'my-custom-toast',
                            style: myCustomStyles,
                            progressClassName: 'my-custom-progress-bar',
                            progressStyle: progressBarStyles,
                            icon: <CustomCheckmark />,
                        });
                        setLoadingStates({ ...loadingStates, [id]: false });
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

                } else {
                    const vote = await setVote(id, currentUserID);

                    if (vote.message === 'Vote successfully counted.') {
                        toast.success('You voted successfully', {
                            position: 'top-right',
                            autoClose: 3000,
                            className: 'my-custom-toast',
                            style: myCustomStyles,
                            progressClassName: 'my-custom-progress-bar',
                            progressStyle: progressBarStyles,
                            icon: <CustomCheckmark />,
                        });
                        setLoadingStates({ ...loadingStates, [id]: false });
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
            }
        }
    }

    const handleSearch = async () => {
        setIsLoading(true);
        const searchedArray = await searchFeatures(searchValue);
        if (searchedArray.length) {
            setIsLoading(false);
            setFeatures(searchedArray);
            setResultsFound(true);
        } else {
            setIsLoading(false);
            setResultsFound(false);
        }
    }


    const handleCloseModal = () => {
        setOpenFeaturesModal(false);
        fetchData(activeSortQuery);
    }

    const handleClearSearch = async () => {
        setSearchValue('');
        fetchData(activeSortQuery);
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
                    onClick={() => sortData('name')}
                >
                    <p>Features</p>
                    {sortOptions.find(option => option.key === 'name')?.direction === 'ascending' ? (
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
            accessor: 'name',
            width: 100,
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => sortData('votes')}
                >
                    <p>Vote</p>
                    {sortOptions.find(option => option.key === 'votes')?.direction === 'ascending' ? (
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
            accessor: 'votes',
            width: 90,
            Cell: ({ value }: { value: number }) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={like} alt='like' />
                        {value}
                    </div>

                </div>
            ),
        },
        {
            Header: (
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <p>Action</p>
                </div>
            ),
            accessor: 'id',
            with: 120,
            Cell: ({ row }: { row: any }) => {
                let isUserVoted;
                const featureId = row.original.id;
                const currentFeature = features.find(feature => feature.id === featureId);
                const userVotedIds = currentFeature?.voted_users || [];

                if (currentUserID) {
                    isUserVoted = userVotedIds.includes(currentUserID);
                }

                return (
                    <div className={styles.btnWrapper}>
                        {loadingStates[row.original.id] ? (
                            <CircleLoader loading={loadingStates[row.original.id]} color={'#556EE6'} size={20} />
                        ) : isUserVoted ? (
                            <div className={styles.votedBtn} onClick={() => handleVote(row.original.id)}>
                                <img alt='voted' src={voted} />
                                Vote
                            </div>
                        ) : (
                            <div className={styles.voteBtn} onClick={() => handleVote(row.original.id)}>
                                Vote
                            </div>
                        )}
                    </div>
                )
            }

        },
    ];

    const columnsHeader: ColumnWithCustomHeader[] = [
        {
            Header: 'LeftHeader',
            width: 332,
            customHeader: (
                <button className={styles.addCompanie} onClick={() => setOpenFeaturesModal(true)}>
                    <img src={plusIcon} alt='add new companie' />
                    Request New features list
                </button>
            ),
        },
        {
            Header: 'RightHeader',
            width: 220,
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

    const indexOfLastUser = (currentPage + 1) * companiesPerPage;
    const indexOfFirstUser = indexOfLastUser - companiesPerPage;
    const currentCompanies = features?.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={styles.wrapper}>
            <div className={styles.tableWrapper}>
                <div className={styles.tableDescription}>
                    <p className={styles.title}>NEW FEATURE</p>
                    <p className={styles.desctiptionText}>Below you can request a new feature and the community can vote on each. </p>
                </div>
                <TableHeader columns={columnsHeader} />
                <TableComponent
                    resultsFound={resultsFound}
                    columns={columns}
                    data={currentCompanies}
                    isLoading={isLoading}
                />


            </div>

            <ReactPaginate
                pageCount={Math.ceil(features?.length / companiesPerPage)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                initialPage={currentPage}
                containerClassName={styles.pagination}
                activeClassName={styles.activePage}
                previousLabel={<button className={styles.pagination__prev}><img alt='prev' src={left} />Prev</button>}
                nextLabel={<button className={styles.pagination__prev}>Next<img alt='next' src={right} /></button>}
            />


            <FeaturesModal isOpen={openFeaturesModal} handleClose={handleCloseModal} />
        </div>
    )
}

export default NewFeature;
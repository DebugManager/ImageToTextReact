import React, { useCallback, useEffect, useState } from 'react';
import { TableComponent, TableHeader } from '../../components';
import { Column } from 'react-table';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { CompanieModal } from './CompanieModal/CompanieModal';
import { deleteCompany, getAllCompanies, getCompanyById, searchCompanies } from '../../services/company.service';
import { CompaniesEditModal } from './CompaniesEditModal/CompaniesEditModal';

import styles from './Companies.module.css';

import left from '../../assets/users-page/left.svg';
import right from '../../assets/users-page/right.svg';
import editIcon from '../../assets/users-page/edit.svg';
import deleteIcon from '../../assets/users-page/delete.svg';
import clearIcon from '../../assets/users-page/x-circle.svg';
import searchIcon from '../../assets/users-page/search.svg';
import plusIcon from '../../assets/users-page/plus.svg';


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

type MyObject = {
    id: number;
    name: string;
    created: string;
};

interface ICompanies {
    id: number;
    name: string;
    created: string;
}

const objects: MyObject[] = [];

for (let i = 1; i <= 10; i++) {
    objects.push({
        id: i,
        name: `Object ${i}`,
        created: new Date().toISOString(),
    });
}

const companiesPerPage = 5;

const Companies = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [resultsFound, setResultsFound] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [openCompanieModal, setOpenCompanieModal] = useState<boolean>(false);
    const [companies, setCompanies] = useState<ICompanies[]>([]);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [companyToEdit, setCompanyToEdit] = useState<number | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllCompanies();
            setCompanies(data);
            setIsLoading(false);
            setResultsFound(true);
        } catch (error) {
            console.error(error, 'error');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleEdit = async (id: number) => {
        setIsEditLoading(true);
        setOpenEditModal(true);
        const data = await getCompanyById(id);
        if (data.id) {
            setIsEditLoading(false);
            setCompanyName(data.name);
            setCompanyToEdit(id);
        }
    }

    const handleDelete = async (id: number) => {
        const res = await deleteCompany(id);
        if (res?.status === 204) {
            toast.success('The company has been successfully created', {
                position: 'top-right',
                autoClose: 3000,
                className: 'my-custom-toast',
                style: myCustomStyles,
                progressClassName: 'my-custom-progress-bar',
                progressStyle: progressBarStyles,
                icon: <CustomCheckmark />,
            });
            fetchData();
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
            fetchData();
        }
    }

    const handleSearch = async () => {
        setIsLoading(true);
        const searchedArray = await searchCompanies(searchValue);
        if (searchedArray.length) {
            setIsLoading(false);
            setCompanies(searchedArray);
            setResultsFound(true);
        } else {
            setIsLoading(false);
            setResultsFound(false);
        }
    }


    const handleCloseModal = () => {
        setOpenCompanieModal(false);
        fetchData();
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        fetchData();
    }

    const handleClearSearch = async () => {
        setSearchValue('');
        fetchData();
    }

    const columns = [
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <p>Name</p>
                </div>
            ),
            accessor: 'name',
            width: 100,
        },
        {
            Header: (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <p>Create</p>
                </div>
            ),
            accessor: 'created',
            width: 80,
            Cell: ({ value }: { value: string }) => (
                <div>
                    {format(new Date(value), 'yyyy-MM-dd')}
                </div>
            ),
        },
        {
            Header: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p>Action</p>
                </div>
            ),
            accessor: 'id',
            // width: 85,
            Cell: ({ row }: { row: any }) => (
                <div className={styles.btnWrapper}>
                    <div className={styles.imageWrapper} onClick={() => handleEdit(row.original.id)}>
                        <img alt='edit' src={editIcon} />
                    </div>

                    <div className={styles.imageWrapper} onClick={() => handleDelete(row.original.id)}>
                        <img alt='delete' src={deleteIcon} />
                    </div>
                </div>
            ),
        },
    ];

    const columnsHeader: ColumnWithCustomHeader[] = [
        {
            Header: 'LeftHeader',
            width: 332,
            customHeader: (
                <button className={styles.addCompanie} onClick={() => setOpenCompanieModal(true)}>
                    <img src={plusIcon} alt='add new companie' />
                    New Company
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
    const currentCompanies = companies?.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={styles.wrapper}>
            <div className={styles.tableWrapper}>
                <div className={styles.tableDescription}>
                    <p className={styles.title}>COMPANIES</p>
                    <p className={styles.desctiptionText}>If you work with multiple Companies, you can add Companies here that can be used for reference when creating new conversions.</p>
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
                pageCount={Math.ceil(companies?.length / companiesPerPage)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                initialPage={currentPage}
                containerClassName={styles.pagination}
                activeClassName={styles.activePage}
                previousLabel={<button className={styles.pagination__prev}><img alt='prev' src={left} />Prev</button>}
                nextLabel={<button className={styles.pagination__prev}>Next<img alt='next' src={right} /></button>}
            />

            <CompanieModal isOpen={openCompanieModal} handleClose={handleCloseModal} />

            {/* {
                (companyToEdit && companyName) && */}
            <CompaniesEditModal
                isOpenEditModal={openEditModal}
                handleCloseEditModal={handleCloseEditModal}
                companyName={companyName}
                companyId={companyToEdit}
                isEditLoading={isEditLoading}
            />
            {/* } */}
        </div>
    )
}

export default Companies;
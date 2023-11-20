import { useCallback, useEffect, useRef, useState } from 'react';
import { Column } from 'react-table';
import { format } from 'date-fns';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';

import { TableComponent, TableHeader } from '../../components';
import { getUser } from '../../services/locastorage.service';
import { getAllInvoces } from '../../services/pricing.service';

import styles from './InvocesTable.module.css';

import arrowDownIcon from '../../assets/users-page/errowDown.svg';
import hashtag from '../../assets/invoceTable/hashtag.svg';
import status from '../../assets/invoceTable/status-online.svg';
import view from '../../assets/invoceTable/view-grid.svg';
import download from '../../assets/invoceTable/download.svg';
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

type IInvoce = {
  id: string;
  amount: number;
  crated_date: string;
  paid_date: string;
  name: string;
  method: string;
  status: string;
  invoice_pdf: string;
};

type ColumnWithCustomHeader = Column<Row> & {
  customHeader: React.ReactNode;
};

const invocesPerPage = 5;

const InvoicesTable: React.FC = () => {
  const methotPopUpRef = useRef<HTMLDivElement | null>(null);
  const packagePopUpRef = useRef<HTMLDivElement | null>(null);
  const statusPopUpRef = useRef<HTMLDivElement | null>(null);

  const [uniqueMethods, setUniqueMethods] = useState<string[]>([]);
  const [uniquePackages, setUniquePackages] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const [typeOfStatus, setTypeOfStatus] = useState<string | null>(null);
  const [typeOfMethod, setTypeOfMethod] = useState<string | null>(null);
  const [typeOfPackage, setTypeOfPackage] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultsFound, setResultsFound] = useState(true);
  const [invoces, setInvoces] = useState<IInvoce[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [activeSortQuery, setActiveSortQuery] = useState<{
    key: string;
    sortDirection?: string;
  }>({
    key: 'id',
    sortDirection: 'ascending',
  });
  const [sortOptions, setSortOptions] = useState<
    {
      key: string;
      direction: string;
    }[]
  >([
    { key: 'id', direction: 'ascending' },
    { key: 'name', direction: 'ascending' },
    { key: 'amount', direction: 'ascending' },
    { key: 'created_date', direction: 'ascending' },
    { key: 'paid_date', direction: 'ascending' },
    { key: 'method', direction: 'ascending' },
    { key: 'status', direction: 'ascending' },
  ]);

  useEffect(() => {
    const userData = getUser();
    if (userData?.customer_id) {
      setCustomerId(userData?.customer_id);
    }
  }, []);

  const fetchData = useCallback(
    async ({
      key,
      sortDirection,
      customerId,
      sortPackage,
      status,
      method,
    }: {
      key?: string;
      sortDirection?: string;
      customerId?: string;
      sortPackage?: string | null | undefined;
      status?: string | null | undefined;
      method?: string | null | undefined;
    }) => {
      setIsLoading(true);
      if (customerId) {
        try {
          console.log(sortPackage, status, method);
          const sortParam = sortDirection === 'descending' ? `-${key}` : key;
          const data = await getAllInvoces(
            sortParam,
            customerId,
            sortPackage ?? undefined,
            status ?? undefined,
            method ?? undefined
          );
          setInvoces(data.data);
          setIsLoading(false);
          setResultsFound(true);
        } catch (error) {
          console.error(error, 'error');
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (customerId) {
      fetchData({
        key: activeSortQuery.key,
        sortPackage: typeOfPackage,
        method: typeOfMethod,
        status: typeOfStatus,
        customerId: customerId,
      });
    }
  }, [typeOfStatus, typeOfMethod, typeOfPackage, customerId, activeSortQuery, fetchData]);

  useEffect(() => {
    if (customerId) {
      fetchData({
        key: activeSortQuery.key,
        sortDirection: activeSortQuery.sortDirection,
        customerId: customerId,
      });
    }
  }, [fetchData, activeSortQuery, customerId]);

  const sortData = (key: string) => {
    const updatedSortOptions = sortOptions.map((option) => {
      if (option.key === key) {
        const direction =
          option.direction === 'ascending' ? 'descending' : 'ascending';
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

  const handleDownload = (link: string) => {
    window.open(link, '_blank');
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const toggleDropdown = useCallback(() => {
    setIsMethodDropdownOpen((prev) => !prev);
  }, []);

  const packageDropdown = useCallback(() => {
    setIsPackageDropdownOpen((prev) => !prev);
  }, []);

  const statusDropdown = useCallback(() => {
    setIsStatusDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const methods = invoces.map((invoice) => invoice.method);
    const uniqueMethods = [...new Set(methods)];
    setUniqueMethods(uniqueMethods);

    const packages = invoces.map((invoice) => invoice.name);
    const uniquePackages = [...new Set(packages)];
    setUniquePackages(uniquePackages);

    const statuses = invoces.map((invoice) => invoice.status);
    const uniqueStatuses = [...new Set(statuses)];
    setUniqueStatuses(uniqueStatuses);
  }, [invoces]);

  const handleClickOutsideMethods = (event: MouseEvent) => {
    if (
      methotPopUpRef.current &&
      !methotPopUpRef.current.contains(event.target as Node)
    ) {
      setIsMethodDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideMethods);

    return () => {
      document.removeEventListener('click', handleClickOutsideMethods);
    };
  }, []);

  const handleClickOutsidePackages = (event: MouseEvent) => {
    if (
      packagePopUpRef.current &&
      !packagePopUpRef.current.contains(event.target as Node)
    ) {
      setIsPackageDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsidePackages);

    return () => {
      document.removeEventListener('click', handleClickOutsidePackages);
    };
  }, []);

  const handleClickOutsideStatuses = (event: MouseEvent) => {
    if (
      statusPopUpRef.current &&
      !statusPopUpRef.current.contains(event.target as Node)
    ) {
      setIsStatusDropdownOpen(false);
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
          onClick={() => sortData('id')}
        >
          <p>Payment ID</p>
          {sortOptions.find((option) => option.key === 'id')?.direction ===
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
      accessor: 'id',
      width: 80,
      Cell: ({ value, row }: { value: string; row: any }) => (
        <Link
          className={styles.linkId}
          to={`/invoce-details/${row.original.id}`}
        >
          {value.slice(0, 7)}...
        </Link>
      ),
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('name')}
        >
          <p>Package</p>
          {sortOptions.find((option) => option.key === 'name')?.direction ===
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
      accessor: 'name',
      width: 75,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('amount')}
        >
          <p>Amount</p>
          {sortOptions.find((option) => option.key === 'amount')?.direction ===
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
      accessor: 'amount',
      width: 70,
      Cell: ({ value }: { value: string }) => <div>{`$${value}`}</div>,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('created_date')}
        >
          <p>Created Date</p>
          {sortOptions.find((option) => option.key === 'created_date')
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
      accessor: 'crated_date',
      width: 85,
      Cell: ({ value }: { value: string }) => (
        <div>{format(new Date(value), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('paid_date')}
        >
          <p>Paid date</p>
          {sortOptions.find((option) => option.key === 'paid_date')
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
      accessor: 'paid_date',
      width: 85,
      Cell: ({ value }: { value: string }) => (
        <div>{format(new Date(value), 'yyyy-MM-dd')}</div>
      ),
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('method')}
        >
          <p>Method</p>
          {sortOptions.find((option) => option.key === 'method')?.direction ===
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
      accessor: 'method',
      width: 70,
    },
    {
      Header: (
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => sortData('status')}
        >
          <p>Status</p>
          {sortOptions.find((option) => option.key === 'status')?.direction ===
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
      accessor: 'status',
      width: 70,
    },
    {
      Header: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>Action</p>
        </div>
      ),
      accessor: 'invoice_pdf',
      width: 165,
      Cell: ({ value }: { value: any }) => (
        <div
          className={styles.btnWrapper}
          onClick={() => handleDownload(value)}
        >
          <img alt='download' src={download} />
          Download Invoice
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
            ref={methotPopUpRef}
          >
            <img src={hashtag} alt='Method' />
            <p>Method</p>
          </div>
          {isMethodDropdownOpen && (
            <div className={styles.optionWrapper}>
              {uniqueMethods.map((method) => (
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
          <div
            className={styles.filterBtnWrapper}
            onClick={packageDropdown}
            ref={packagePopUpRef}
          >
            <img src={view} alt='Package' />
            <p>Package</p>
          </div>
          {isPackageDropdownOpen && (
            <div className={styles.optionPackageWrapper}>
              {uniquePackages.map((method) => (
                <div
                  key={method}
                  onClick={() => {
                    setTypeOfPackage(method);
                  }}
                  className={styles.optionFilter}
                >
                  {method}
                </div>
              ))}
            </div>
          )}
          <div
            className={styles.filterBtnWrapper}
            onClick={statusDropdown}
            ref={statusPopUpRef}
          >
            <img src={status} alt='Status' />
            <p>Status</p>
          </div>
          {isStatusDropdownOpen && (
            <div className={styles.optionStatusWrapper}>
              {uniqueStatuses.map((method) => (
                <div
                  key={method}
                  onClick={() => {
                    setTypeOfStatus(method);
                  }}
                  className={styles.optionFilter}
                >
                  {method}
                </div>
              ))}
            </div>
          )}

          {typeOfStatus && (
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
                label={typeOfStatus.toUpperCase()}
                onDelete={() => setTypeOfStatus(null)}
              />
          )}
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
          {typeOfPackage && (
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
              label={typeOfPackage.toUpperCase()}
              onDelete={() => setTypeOfPackage(null)}
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
          {/* <input
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
                    </div> */}
        </div>
      ),
    },
  ];

  const indexOfLastUser = (currentPage + 1) * invocesPerPage;
  const indexOfFirstUser = indexOfLastUser - invocesPerPage;
  const currentInvoces = invoces?.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <TableHeader columns={columnsHeader} />
        <TableComponent
          resultsFound={resultsFound}
          columns={columns}
          data={currentInvoces}
          isLoading={isLoading}
        />
      </div>

      <ReactPaginate
        pageCount={Math.ceil(invoces?.length / invocesPerPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        initialPage={currentPage}
        containerClassName={styles.pagination}
        activeClassName={styles.activePage}
        previousLabel={
          <button className={styles.pagination__prev}>
            <img alt='prev' src={left} />
            Prev
          </button>
        }
        nextLabel={
          <button className={styles.pagination__prev}>
            Next
            <img alt='next' src={right} />
          </button>
        }
      />
    </div>
  );
};

export default InvoicesTable;

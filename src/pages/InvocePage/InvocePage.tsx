import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';
import { format } from 'date-fns';

import { getInvoiceDetails } from '../../services/pricing.service';

import styles from './InvocePage.module.css';

import print from '../../assets/invoceTable/printer.svg';

interface IInvoice {
  id: string;
  account_country: string;
  account_name: string;
  amount: number;
  created: string;
  currency: string;
  name: string;
  address: string;
  brand: string;
  last4: number;
  product_name: string;
  interval: string;
  description: string;
  invoice_pdf: string;
  email: string;
}

const InvoicePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const { id } = useParams();

  const fetchData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await getInvoiceDetails(id);
      setInvoice(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error, 'error');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, fetchData]);

  const handleDownload = (link?: string) => {
    window.open(link, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.pageTitle}>PRICING</p>

      {isLoading ? (
        <CircleLoader loading={isLoading} color={'#556EE6'} size={50} />
      ) : (
        <div className={styles.invoceWrapper}>
          <div className={styles.invoceHeaderWrapper}>
            <p className={styles.invoceTitle}>Invoice</p>
            <p className={styles.invoceTitle}>Order #33213</p>
          </div>

          <div className={styles.infoWrapper}>
            <div className={styles.rowWrapper}>
              <div className={styles.columnWrapper}>
                <p className={styles.columnTitle}>Billed To:</p>
                <div className={styles.userInfoWrapper}>
                  <p className={`${styles.userInfo} ${styles.alignLeft}`}>
                    Jhon Smith
                  </p>
                  <p className={`${styles.userInfo} ${styles.alignLeft}`}>
                    {invoice?.account_country}
                  </p>
                  <p className={`${styles.userInfo} ${styles.alignLeft}`}>
                    {invoice?.account_name}
                  </p>
                </div>
              </div>
              <div className={styles.columnWrapper}>
                <p className={`${styles.columnTitle} ${styles.alignRight}`}>
                  From:
                </p>
                <div className={styles.userInfoWrapper}>
                  <p className={`${styles.userInfo} ${styles.alignRight}`}>
                    {invoice?.name}
                  </p>
                  <p className={`${styles.userInfo} ${styles.alignRight}`}>
                    {invoice?.address}
                  </p>
                  <p className={`${styles.userInfo} ${styles.alignRight}`}>
                    {invoice?.brand} {invoice?.last4}
                  </p>
                  <p className={`${styles.userInfo} ${styles.alignRight}`}>
                    {invoice?.email}
                  </p>
                  <div className={styles.orderDateWrapper}>
                    <p className={`${styles.columnTitle} ${styles.alignRight}`}>
                      Order Date:
                    </p>
                    <p className={`${styles.userInfo} ${styles.alignRight}`}>
                      {invoice &&
                        invoice.created &&
                        format(new Date(invoice.created), 'yyyy-MM-dd')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.orderSummaryWrapper}>
              <p className={styles.columnTitle}>Order Sumary</p>
            </div>

            <div className={styles.priceWrapper}>
              <p className={styles.userInfo}>01</p>
              <p className={styles.userInfo}>
                Pricing plan - {invoice?.product_name}
              </p>
              <p className={styles.userInfo}>${(invoice?.amount ?? 0) / 100}</p>
            </div>

            <div className={styles.totalWrapper}>
              <div />
              <p className={styles.columnTitle}>Total</p>
              <p className={styles.columnTitle}>
                ${(invoice?.amount ?? 0) / 100}
              </p>
            </div>

            <div className={styles.buttonWrapper}>
              <button className={styles.printButton} onClick={handlePrint}>
                <img src={print} alt='print' />
              </button>
              <button
                className={styles.downloadBtn}
                onClick={() => handleDownload(invoice?.invoice_pdf)}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;

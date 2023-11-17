import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';

import { getPageByID } from '../../services/pages.service';

import styles from './SupportPagePost.module.css';

interface IPage {
  collum_title: string;
  description: string;
  id: number;
  image_url: string;
  title: string;
}

const SupportPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [page, setPage] = useState<IPage | null>(null);
  const [isPagesIsLoading, setPagesIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (id: string) => {
    setPagesIsLoading(true);
    try {
      const data = await getPageByID(id);
      setPage(data);
      setPagesIsLoading(false);
    } catch (error) {
      console.error(error, 'error');
      setPagesIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [fetchData, id]);

  return (
    <div className={styles.wrapper}>
      {isPagesIsLoading ? (
        <CircleLoader loading={isPagesIsLoading} color={'#556EE6'} size={50} />
      ) : (
        <div className={styles.pageWrapper}>
          <p className={styles.title}>{page?.title}</p>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: page?.description || '' }}
          />
          <div className={styles.imgWrapper}>
            {page?.image_url && <img alt={page?.title} src={page?.image_url} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPostPage;

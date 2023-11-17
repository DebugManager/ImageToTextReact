import { useCallback, useEffect, useState } from 'react';
import { CreatePagesEnums } from '../../enums/PagesEnums';
import { Link } from 'react-router-dom';
import { getPages } from '../../services/pages.service';

import styles from './SupportPage.module.css';


interface IPage {
  collum_title: string;
  description: string;
  id: number;
  image_url: string;
  title: string;
}

const SupportPage: React.FC = () => {
  const [pages, setPages] = useState<IPage[] | null>(null);
//   const [isPagesIsLoading, setPagesIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    // setPagesIsLoading(true);
    try {
      const data = await getPages();
      setPages(data);
    //   setPagesIsLoading(false);
    } catch (error) {
      console.error(error, 'error');
    //   setPagesIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groupedPages: { [key: string]: IPage[] } = {};

  pages?.forEach((page) => {
    const title = page.collum_title;
    if (!groupedPages[title]) {
      groupedPages[title] = [];
    }
    groupedPages[title].push(page);
  });

  const topCategories = [
    CreatePagesEnums.Home,
    CreatePagesEnums.Search,
    CreatePagesEnums.Engage,
    CreatePagesEnums.FAQ,
  ];

  const bottomCategories = [
    CreatePagesEnums.Enrich,
    CreatePagesEnums.Opportunities,
    CreatePagesEnums.Settings,
  ];

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>What do you need help with?</p>
      <div className={styles.tableWrapper}>
        <div className={styles.topWrapper}>
          <p className={styles.textTitle}>Articles in ths category</p>
        </div>
        <div className={styles.centerWrapper}>
          {topCategories.map((category) => (
            <div key={category}>
              <div className={styles.categoryMainTitle}>{category}</div>
              {groupedPages[category]?.map((el) => (
                <Link to={`/support/${el.id}`} key={el.id} className={styles.categoryTitle}>{el.title}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.bottomWrapper}>
          {bottomCategories.map((category) => (
            <div key={category}>
              <div className={styles.categoryMainTitle}>{category}</div>
              {groupedPages[category]?.map((el) => (
                <Link to={`/support/${el.id}`} key={el.id} className={styles.categoryTitle}>{el.title}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

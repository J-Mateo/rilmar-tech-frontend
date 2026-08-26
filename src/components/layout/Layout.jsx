import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Footer } from './Footer';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />

      <div className={styles.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
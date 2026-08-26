import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <h1 className={styles.code}>
        404
      </h1>

      <p className={styles.message}>
        Página no encontrada
      </p>

      <Link
        to="/"
        className={styles.homeLink}
      >
        Volver al inicio
      </Link>
    </main>
  );
};

export default NotFoundPage;
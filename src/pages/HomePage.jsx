import { useMemo } from 'react';

import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';
import styles from './HomePage.module.css';

const HomePage = () => {
  const homeParams = useMemo(
    () => ({ limit: 8 }),
    []
  );

  const {
    products = [],
    loading,
    error,
    refetch,
  } = useProducts(homeParams);

  if (loading) {
    return (
      <div className={styles.state}>
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p className={styles.errorMessage}>
          {error}
        </p>

        <Button
          onClick={refetch}
          variant="primary"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Tecnología innovadora para la vida cotidiana
        </h1>

        <p className={styles.subtitle}>
          Descubre nuestra selección de productos tecnológicos que mejoran tu día a día
        </p>
      </header>

      <section aria-labelledby="featured-products-title">
        <h2
          id="featured-products-title"
          className={styles.sectionTitle}
        >
          Productos Destacados
        </h2>

        <ProductGrid products={products} />
      </section>
    </main>
  );
};

export default HomePage;
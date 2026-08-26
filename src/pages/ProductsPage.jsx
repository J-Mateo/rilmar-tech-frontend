import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';
import styles from './ProductsPage.module.css';

const CATEGORY_LABELS = {
  Productividad: 'Productividad',
  Workspace: 'Workspace',
  Audio: 'Audio',
  SmartHome: 'Smart Home',
  Creatividad: 'Creatividad',
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = useMemo(() => {
    const params = {};

    if (category) {
      params.category = category;
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    return params;
  }, [category, debouncedSearch]);

  const {
    products = [],
    loading,
    error,
    refetch,
  } = useProducts(queryParams);

  return (
    <main className={styles.page}>
      <div
        className={styles.filterBar}
        role="search"
        aria-label="Filtros de productos"
      >
        <input
          type="search"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          className={styles.searchInput}
          aria-label="Buscar productos"
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className={styles.categorySelect}
          aria-label="Filtrar por categoría"
        >
          <option value="">
            Todas las categorías
          </option>

          {CATEGORIES.map((currentCategory) => (
            <option
              key={currentCategory}
              value={currentCategory}
            >
              {CATEGORY_LABELS[currentCategory]}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className={styles.state}>
          <p>
            Cargando catálogo de productos...
          </p>
        </div>
      )}

      {error && (
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
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <p className={styles.emptyState}>
            No se encontraron productos.
          </p>
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <ProductGrid products={products} />
        )}
    </main>
  );
};

export default ProductsPage;
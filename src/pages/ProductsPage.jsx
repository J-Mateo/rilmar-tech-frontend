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

const SORT_OPTIONS = [
  {
    label: 'Más recientes',
    sortBy: 'createdAt',
    order: 'desc',
  },
  {
    label: 'Precio: menor a mayor',
    sortBy: 'price',
    order: 'asc',
  },
  {
    label: 'Precio: mayor a menor',
    sortBy: 'price',
    order: 'desc',
  },
];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');
  const [category, setCategory] = useState('');
  const [sortOption, setSortOption] = useState(
    'createdAt-desc'
  );

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
      params.search =
        debouncedSearch.trim();
    }

    const [sortBy, order] =
      sortOption.split('-');

    if (sortBy && order) {
      params.sortBy = sortBy;
      params.order = order;
    }

    return params;
  }, [
    category,
    debouncedSearch,
    sortOption,
  ]);

  const {
    products = [],
    loading,
    refreshing,
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
            setSearchTerm(
              event.target.value
            )
          }
          className={styles.searchInput}
          aria-label="Buscar productos"
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
          className={
            styles.categorySelect
          }
          aria-label="Filtrar por categoría"
        >
          <option value="">
            Todas las categorías
          </option>

          {CATEGORIES.map(
            (currentCategory) => (
              <option
                key={currentCategory}
                value={currentCategory}
              >
                {
                  CATEGORY_LABELS[
                    currentCategory
                  ]
                }
              </option>
            )
          )}
        </select>

        <select
          value={sortOption}
          onChange={(event) =>
            setSortOption(
              event.target.value
            )
          }
          className={styles.sortSelect}
          aria-label="Ordenar productos"
        >
          {SORT_OPTIONS.map(
            (option) => (
              <option
                key={`${option.sortBy}-${option.order}`}
                value={`${option.sortBy}-${option.order}`}
              >
                {option.label}
              </option>
            )
          )}
        </select>
      </div>

      {refreshing && (
        <p
          className={styles.refreshingState}
          role="status"
          aria-live="polite"
        >
          Actualizando productos...
        </p>
      )}

      {loading && (
        <div
          className={styles.state}
          role="status"
          aria-live="polite"
        >
          <p>
            Cargando catálogo de productos...
          </p>
        </div>
      )}

      {!loading && error && (
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
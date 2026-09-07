import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';
import styles from './ProductsPage.module.css';

const CATEGORY_OPTIONS = [
  'Workspace',
  'Productividad',
  'Creatividad',
  'Smart Home',
  'Audio',
];

const SORT_OPTIONS = [
  {
    label:
      'Más recientes',
    sortBy:
      'createdAt',
    order:
      'desc',
  },
  {
    label:
      'Precio: menor a mayor',
    sortBy:
      'price',
    order:
      'asc',
  },
  {
    label:
      'Precio: mayor a menor',
    sortBy:
      'price',
    order:
      'desc',
  },
  {
    label:
      'Disponibles primero',
    sortBy:
      'availability',
    order:
      'desc',
  },
];

const FILTER_DEBOUNCE_MS =
  350;

const ProductsPage = () => {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  const [
    category,
    setCategory,
  ] = useState('');

  const [
    availability,
    setAvailability,
  ] = useState('');

  const [
    minPrice,
    setMinPrice,
  ] = useState('');

  const [
    maxPrice,
    setMaxPrice,
  ] = useState('');

  const [
    debouncedMinPrice,
    setDebouncedMinPrice,
  ] = useState('');

  const [
    debouncedMaxPrice,
    setDebouncedMaxPrice,
  ] = useState('');

  const [
    sortOption,
    setSortOption,
  ] = useState(
    'createdAt-desc'
  );

  useEffect(() => {
    const handler =
      window.setTimeout(() => {
        setDebouncedSearch(
          searchTerm.trim()
        );
      }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(
        handler
      );
    };
  }, [searchTerm]);

  useEffect(() => {
    const handler =
      window.setTimeout(() => {
        setDebouncedMinPrice(
          minPrice
        );

        setDebouncedMaxPrice(
          maxPrice
        );
      }, FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(
        handler
      );
    };
  }, [
    minPrice,
    maxPrice,
  ]);

  const queryParams =
    useMemo(() => {
      const params =
        {};

      if (category) {
        params.category =
          category;
      }

      if (
        debouncedSearch
      ) {
        params.search =
          debouncedSearch;
      }

      if (
        debouncedMinPrice !==
        ''
      ) {
        params.minPrice =
          debouncedMinPrice;
      }

      if (
        debouncedMaxPrice !==
        ''
      ) {
        params.maxPrice =
          debouncedMaxPrice;
      }

      if (
        availability
      ) {
        params.availability =
          availability;
      }

      const [
        sortBy,
        order,
      ] =
        sortOption.split(
          '-'
        );

      if (
        sortBy &&
        order
      ) {
        params.sortBy =
          sortBy;

        params.order =
          order;
      }

      return params;
    }, [
      category,
      debouncedSearch,
      debouncedMinPrice,
      debouncedMaxPrice,
      availability,
      sortOption,
    ]);

  const {
    products = [],
    loading,
    refreshing,
    error,
    refetch,
  } = useProducts(
    queryParams
  );

  const hasActiveFilters =
    Boolean(
      searchTerm ||
      category ||
      availability ||
      minPrice ||
      maxPrice ||
      sortOption !==
        'createdAt-desc'
    );

  const handleClearFilters =
    () => {
      setSearchTerm('');
      setDebouncedSearch('');

      setCategory('');
      setAvailability('');

      setMinPrice('');
      setMaxPrice('');

      setDebouncedMinPrice('');
      setDebouncedMaxPrice('');

      setSortOption(
        'createdAt-desc'
      );
    };

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.filterBar
        }
        role="search"
        aria-label="Filtros de productos"
      >
        <input
          type="search"
          placeholder="Buscar productos..."
          value={
            searchTerm
          }
          onChange={(
            event
          ) =>
            setSearchTerm(
              event.target.value
            )
          }
          className={
            styles.searchInput
          }
          aria-label="Buscar productos"
        />

        <select
          value={
            category
          }
          onChange={(
            event
          ) =>
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

          {CATEGORY_OPTIONS.map(
            (
              currentCategory
            ) => (
              <option
                key={
                  currentCategory
                }
                value={
                  currentCategory
                }
              >
                {
                  currentCategory
                }
              </option>
            )
          )}
        </select>

        <select
          value={
            availability
          }
          onChange={(
            event
          ) =>
            setAvailability(
              event.target.value
            )
          }
          className={
            styles.categorySelect
          }
          aria-label="Filtrar por disponibilidad"
        >
          <option value="">
            Toda disponibilidad
          </option>

          <option value="inStock">
            Disponibles
          </option>

          <option value="outOfStock">
            Agotados
          </option>
        </select>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio mín."
          value={
            minPrice
          }
          onChange={(
            event
          ) =>
            setMinPrice(
              event.target.value
            )
          }
          className={
            styles.searchInput
          }
          aria-label="Precio mínimo"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio máx."
          value={
            maxPrice
          }
          onChange={(
            event
          ) =>
            setMaxPrice(
              event.target.value
            )
          }
          className={
            styles.searchInput
          }
          aria-label="Precio máximo"
        />

        <select
          value={
            sortOption
          }
          onChange={(
            event
          ) =>
            setSortOption(
              event.target.value
            )
          }
          className={
            styles.sortSelect
          }
          aria-label="Ordenar productos"
        >
          {SORT_OPTIONS.map(
            (option) => (
              <option
                key={`${option.sortBy}-${option.order}`}
                value={`${option.sortBy}-${option.order}`}
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="secondary"
            onClick={
              handleClearFilters
            }
          >
            Limpiar
          </Button>
        )}
      </div>

      {refreshing && (
        <p
          className={
            styles.refreshingState
          }
          role="status"
          aria-live="polite"
        >
          Actualizando productos...
        </p>
      )}

      {loading && (
        <div
          className={
            styles.state
          }
          role="status"
          aria-live="polite"
        >
          <p>
            Cargando catálogo de productos...
          </p>
        </div>
      )}

      {!loading &&
        error && (
        <div
          className={
            styles.errorState
          }
        >
          <p
            className={
              styles.errorMessage
            }
          >
            {error}
          </p>

          <Button
            onClick={
              refetch
            }
            variant="primary"
          >
            Reintentar
          </Button>
        </div>
      )}

      {!loading &&
        !error &&
        products.length ===
          0 && (
        <p
          className={
            styles.emptyState
          }
        >
          No se encontraron
          productos con los
          filtros seleccionados.
        </p>
      )}

      {!loading &&
        !error &&
        products.length >
          0 && (
        <ProductGrid
          products={
            products
          }
        />
      )}
    </main>
  );
};

export default ProductsPage;
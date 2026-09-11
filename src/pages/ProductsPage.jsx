import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import {
  useSearchParams,
} from 'react-router-dom';

import {
  useProducts,
} from '../hooks/useProducts';

import CatalogRow from '../components/catalog/CatalogRow';
import CatalogProductCard from '../components/catalog/CatalogProductCard';

import heroCatalogImage from '../assets/hero-catalogo.jpg';

import styles from './ProductsPage.module.css';

const CATEGORY_OPTIONS = [
  'Audio',
  'Smart Home',
  'Workspace',
  'Productividad',
  'Creatividad',
];

const CATEGORY_DESCRIPTIONS = {
  Audio:
    'Sonido que te acompaña en cada momento.',
  'Smart Home':
    'Convierte tu hogar en un espacio más inteligente.',
  Workspace:
    'Potencia tu productividad donde estés.',
  Productividad:
    'Herramientas pensadas para aprovechar mejor tu tiempo.',
  Creatividad:
    'Tecnología para imaginar, crear y experimentar.',
};

const SORT_OPTIONS = [
  {
    label: 'Más recientes',
    value: 'createdAt-desc',
  },
  {
    label:
      'Precio: menor a mayor',
    value: 'price-asc',
  },
  {
    label:
      'Precio: mayor a menor',
    value: 'price-desc',
  },
  {
    label:
      'Disponibles primero',
    value:
      'availability-desc',
  },
];

const FILTER_DEBOUNCE_MS =
  350;

const getValidCategory = (
  value
) =>
  CATEGORY_OPTIONS.includes(
    value
  )
    ? value
    : '';

const ProductsPage = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');

  const [
    debouncedSearch,
    setDebouncedSearch,
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

  const [
    filtersOpen,
    setFiltersOpen,
  ] = useState(false);

  const category =
    getValidCategory(
      searchParams.get(
        'category'
      ) ?? ''
    );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            searchTerm.trim()
          );
        },
        FILTER_DEBOUNCE_MS
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [searchTerm]);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedMinPrice(
            minPrice
          );

          setDebouncedMaxPrice(
            maxPrice
          );
        },
        FILTER_DEBOUNCE_MS
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    minPrice,
    maxPrice,
  ]);

  const queryParams =
    useMemo(() => {
      const params = {
        limit: 50,
      };

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

      if (availability) {
        params.availability =
          availability;
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
      availability,
      debouncedMinPrice,
      debouncedMaxPrice,
      sortOption,
    ]);

  const {
    products = [],
    loading,
    refreshing,
    error,
    refetch,
  } =
    useProducts(
      queryParams
    );

  const hasFiltering =
    Boolean(
      category ||
        debouncedSearch ||
        availability ||
        debouncedMinPrice !==
          '' ||
        debouncedMaxPrice !==
          ''
    );

  const activeFilterCount =
    [
      category,
      availability,
      minPrice,
      maxPrice,
    ].filter(Boolean)
      .length;

  const productsByCategory =
    useMemo(() => {
      if (hasFiltering) {
        return {};
      }

      return CATEGORY_OPTIONS.reduce(
        (
          groups,
          currentCategory
        ) => {
          groups[
            currentCategory
          ] =
            products.filter(
              (product) =>
                product.category ===
                currentCategory
            );

          return groups;
        },
        {}
      );
    }, [
      products,
      hasFiltering,
    ]);

  const updateCategory =
    (nextCategory) => {
      const nextParams =
        new URLSearchParams(
          searchParams
        );

      if (nextCategory) {
        nextParams.set(
          'category',
          nextCategory
        );
      } else {
        nextParams.delete(
          'category'
        );
      }

      setSearchParams(
        nextParams,
        {
          replace: true,
        }
      );
    };

  const clearSearch =
    () => {
      setSearchTerm('');

      setDebouncedSearch(
        ''
      );
    };

  const clearFilters =
    () => {
      setAvailability('');

      setMinPrice('');
      setMaxPrice('');

      setDebouncedMinPrice(
        ''
      );

      setDebouncedMaxPrice(
        ''
      );

      setSortOption(
        'createdAt-desc'
      );

      updateCategory('');
    };

  const clearEverything =
    () => {
      clearSearch();
      clearFilters();
    };

  const resultLabel =
    products.length === 1
      ? '1 producto'
      : `${products.length} productos`;

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.hero
        }
      >
        <img
          src={
            heroCatalogImage
          }
          alt=""
          className={
            styles.heroImage
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroOverlay
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroContent
          }
        >
          <p
            className={
              styles.heroEyebrow
            }
          >
            Catálogo
          </p>

          <h1
            className={
              styles.heroTitle
            }
          >
            Tecnología elegida
            <br />
            para tu día a día.
          </h1>

          <p
            className={
              styles.heroDescription
            }
          >
            Una selección de
            productos para
            trabajar, crear,
            disfrutar y vivir
            mejor.
          </p>
        </div>

        <div
          className={
            styles.searchBox
          }
          role="search"
        >
          <Search
            size={19}
            aria-hidden="true"
          />

          <input
            type="search"
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />

          {searchTerm && (
            <button
              type="button"
              className={
                styles.searchClear
              }
              onClick={
                clearSearch
              }
              aria-label="Limpiar búsqueda"
            >
              <X
                size={17}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </section>

      <section
        className={
          styles.catalogControls
        }
        aria-label="Categorías y filtros"
      >
        <div
          className={
            styles.categoryScroller
          }
        >
          <button
            type="button"
            className={`${styles.categoryChip} ${
              !category
                ? styles.categoryChipActive
                : ''
            }`}
            onClick={() =>
              updateCategory('')
            }
          >
            Todos
          </button>

          {CATEGORY_OPTIONS.map(
            (
              currentCategory
            ) => (
              <button
                key={
                  currentCategory
                }
                type="button"
                className={`${styles.categoryChip} ${
                  category ===
                  currentCategory
                    ? styles.categoryChipActive
                    : ''
                }`}
                onClick={() =>
                  updateCategory(
                    currentCategory
                  )
                }
              >
                {
                  currentCategory
                }
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className={`${styles.filtersButton} ${
            filtersOpen
              ? styles.filtersButtonActive
              : ''
          }`}
          onClick={() =>
            setFiltersOpen(
              (current) =>
                !current
            )
          }
          aria-expanded={
            filtersOpen
          }
        >
          <SlidersHorizontal
            size={17}
            aria-hidden="true"
          />

          Filtros

          {activeFilterCount >
            0 && (
            <span
              className={
                styles.filtersCount
              }
            >
              {
                activeFilterCount
              }
            </span>
          )}
        </button>
      </section>

      {filtersOpen && (
        <>
          <button
            type="button"
            className={
              styles.filterBackdrop
            }
            onClick={() =>
              setFiltersOpen(
                false
              )
            }
            aria-label="Cerrar filtros"
          />

          <section
            className={
              styles.filtersPanel
            }
            aria-label="Filtros de productos"
          >
            <div
              className={
                styles.filtersPanelHeader
              }
            >
              <div>
                <p>
                  Personaliza tu
                  búsqueda
                </p>

                <h2>
                  Filtros
                </h2>
              </div>

              <button
                type="button"
                className={
                  styles.closeFilters
                }
                onClick={() =>
                  setFiltersOpen(
                    false
                  )
                }
                aria-label="Cerrar filtros"
              >
                <X
                  size={20}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div
              className={
                styles.filterFields
              }
            >
              <label
                className={`${styles.filterField} ${styles.categoryFilterField}`}
              >
                <span>
                  Categoría
                </span>

                <select
                  value={
                    category
                  }
                  onChange={(
                    event
                  ) =>
                    updateCategory(
                      event.target
                        .value
                    )
                  }
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
              </label>

              <label
                className={
                  styles.filterField
                }
              >
                <span>
                  Disponibilidad
                </span>

                <select
                  value={
                    availability
                  }
                  onChange={(
                    event
                  ) =>
                    setAvailability(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="">
                    Todos
                  </option>

                  <option value="inStock">
                    Disponibles
                  </option>

                  <option value="outOfStock">
                    Agotados
                  </option>
                </select>
              </label>

              <label
                className={
                  styles.filterField
                }
              >
                <span>
                  Precio desde
                </span>

                <div
                  className={
                    styles.priceInput
                  }
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      minPrice
                    }
                    onChange={(
                      event
                    ) =>
                      setMinPrice(
                        event.target
                          .value
                      )
                    }
                    placeholder="0"
                  />

                  <span>
                    €
                  </span>
                </div>
              </label>

              <label
                className={
                  styles.filterField
                }
              >
                <span>
                  Precio hasta
                </span>

                <div
                  className={
                    styles.priceInput
                  }
                >
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      maxPrice
                    }
                    onChange={(
                      event
                    ) =>
                      setMaxPrice(
                        event.target
                          .value
                      )
                    }
                    placeholder="Máx."
                  />

                  <span>
                    €
                  </span>
                </div>
              </label>

              <label
                className={
                  styles.filterField
                }
              >
                <span>
                  Ordenar por
                </span>

                <select
                  value={
                    sortOption
                  }
                  onChange={(
                    event
                  ) =>
                    setSortOption(
                      event.target
                        .value
                    )
                  }
                >
                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <div
              className={
                styles.filterActions
              }
            >
              <button
                type="button"
                className={
                  styles.clearFiltersButton
                }
                onClick={
                  clearFilters
                }
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                className={
                  styles.applyFiltersButton
                }
                onClick={() =>
                  setFiltersOpen(
                    false
                  )
                }
              >
                Ver {resultLabel}
              </button>
            </div>
          </section>
        </>
      )}

      {refreshing && (
        <p
          className={
            styles.refreshing
          }
          role="status"
        >
          Actualizando
          resultados...
        </p>
      )}

      {loading && (
        <section
          className={
            styles.state
          }
        >
          <span
            className={
              styles.loader
            }
          />

          <p>
            Cargando catálogo...
          </p>
        </section>
      )}

      {!loading &&
        error && (
          <section
            className={
              styles.state
            }
          >
            <h2>
              No hemos podido
              cargar el catálogo
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className={
                styles.stateButton
              }
              onClick={
                refetch
              }
            >
              Reintentar
            </button>
          </section>
        )}

      {!loading &&
        !error &&
        !hasFiltering && (
          <div
            className={
              styles.discovery
            }
          >
            {CATEGORY_OPTIONS.map(
              (
                currentCategory
              ) => {
                const categoryProducts =
                  productsByCategory[
                    currentCategory
                  ] ?? [];

                if (
                  !categoryProducts.length
                ) {
                  return null;
                }

                return (
                  <CatalogRow
                    key={
                      currentCategory
                    }
                    title={
                      currentCategory
                    }
                    description={
                      CATEGORY_DESCRIPTIONS[
                        currentCategory
                      ]
                    }
                    products={
                      categoryProducts
                    }
                    onViewAll={() =>
                      updateCategory(
                        currentCategory
                      )
                    }
                  />
                );
              }
            )}
          </div>
        )}

      {!loading &&
        !error &&
        hasFiltering && (
          <section
            className={
              styles.filteredSection
            }
          >
            <div
              className={
                styles.filteredHeader
              }
            >
              <div>
                <p
                  className={
                    styles.filteredEyebrow
                  }
                >
                  {category ||
                    'Resultados'}
                </p>

                <h2>
                  {category ||
                    (debouncedSearch
                      ? `Resultados para “${debouncedSearch}”`
                      : 'Productos')}
                </h2>

                <p
                  className={
                    styles.filteredCount
                  }
                >
                  {resultLabel}
                </p>
              </div>

              <label
                className={
                  styles.inlineSort
                }
              >
                <span>
                  Ordenar por
                </span>

                <select
                  value={
                    sortOption
                  }
                  onChange={(
                    event
                  ) =>
                    setSortOption(
                      event.target
                        .value
                    )
                  }
                >
                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            {(category ||
              availability ||
              minPrice ||
              maxPrice ||
              debouncedSearch) && (
              <div
                className={
                  styles.activeFilters
                }
              >
                {debouncedSearch && (
                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                  >
                    “{debouncedSearch}”

                    <X
                      size={13}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {category && (
                  <button
                    type="button"
                    onClick={() =>
                      updateCategory(
                        ''
                      )
                    }
                  >
                    {category}

                    <X
                      size={13}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {availability && (
                  <button
                    type="button"
                    onClick={() =>
                      setAvailability(
                        ''
                      )
                    }
                  >
                    {availability ===
                    'inStock'
                      ? 'Disponibles'
                      : 'Agotados'}

                    <X
                      size={13}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {minPrice && (
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(
                        ''
                      );

                      setDebouncedMinPrice(
                        ''
                      );
                    }}
                  >
                    Desde {minPrice} €

                    <X
                      size={13}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {maxPrice && (
                  <button
                    type="button"
                    onClick={() => {
                      setMaxPrice(
                        ''
                      );

                      setDebouncedMaxPrice(
                        ''
                      );
                    }}
                  >
                    Hasta {maxPrice} €

                    <X
                      size={13}
                      aria-hidden="true"
                    />
                  </button>
                )}

                <button
                  type="button"
                  className={
                    styles.clearAllChip
                  }
                  onClick={
                    clearEverything
                  }
                >
                  Limpiar todo
                </button>
              </div>
            )}

            {products.length >
            0 ? (
              <div
                className={
                  styles.filteredGrid
                }
              >
                {products.map(
                  (product) => (
                    <CatalogProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className={
                  styles.emptyState
                }
              >
                <Search
                  size={26}
                  aria-hidden="true"
                />

                <h3>
                  No encontramos
                  productos
                </h3>

                <p>
                  Prueba con otra
                  búsqueda o modifica
                  alguno de los
                  filtros.
                </p>

                <button
                  type="button"
                  onClick={
                    clearEverything
                  }
                >
                  Ver todos los
                  productos
                </button>
              </div>
            )}
          </section>
        )}
    </main>
  );
};

export default ProductsPage;
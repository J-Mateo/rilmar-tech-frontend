import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  deactivateProductApi,
  getAdminProducts,
  restoreProductApi,
} from '../../api/products.api';

import styles from './AdminProducts.module.css';

const CATEGORY_OPTIONS = [
  'Workspace',
  'Productividad',
  'Creatividad',
  'Smart Home',
  'Audio',
];

const SEARCH_DEBOUNCE_MS = 350;

const AdminProducts = () => {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    meta,
    setMeta,
  ] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    category,
    setCategory,
  ] = useState('');

  const [
    status,
    setStatus,
  ] = useState('');

  const [
    stock,
    setStock,
  ] = useState('');

  const [
    appliedSearch,
    setAppliedSearch,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState(null);

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        const normalizedSearch =
          search.trim();

        setMeta(
          (current) => ({
            ...current,
            page: 1,
          })
        );

        setAppliedSearch(
          normalizedSearch
        );
      }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [search]);

  useEffect(() => {
    const controller =
      new AbortController();

    const loadProducts =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await getAdminProducts(
              {
                page:
                  meta.page,

                limit:
                  meta.limit,

                search:
                  appliedSearch,

                category,

                status,

                stock,
              },
              {
                signal:
                  controller.signal,
              }
            );

          setProducts(
            response.data ?? []
          );

          setMeta(
            (current) => ({
              ...current,
              ...(response.meta ??
                {}),
            })
          );
        } catch (
          requestError
        ) {
          if (
            requestError?.code ===
            'REQUEST_CANCELED'
          ) {
            return;
          }

          setError(
            requestError?.message ||
              'No se han podido cargar los productos'
          );
        } finally {
          if (
            !controller
              .signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [
    meta.page,
    meta.limit,
    appliedSearch,
    category,
    status,
    stock,
    reloadKey,
  ]);

  const resetToFirstPage =
    () => {
      setMeta(
        (current) => ({
          ...current,
          page: 1,
        })
      );
    };

  const handleCategoryChange =
    (event) => {
      resetToFirstPage();

      setCategory(
        event.target.value
      );
    };

  const handleStatusChange =
    (event) => {
      resetToFirstPage();

      setStatus(
        event.target.value
      );
    };

  const handleStockChange =
    (event) => {
      resetToFirstPage();

      setStock(
        event.target.value
      );
    };

  const handleClearFilters =
    () => {
      setSearch('');
      setAppliedSearch('');
      setCategory('');
      setStatus('');
      setStock('');

      resetToFirstPage();
    };

  const handlePreviousPage =
    () => {
      setMeta(
        (current) => ({
          ...current,

          page:
            Math.max(
              1,
              current.page - 1
            ),
        })
      );
    };

  const handleNextPage =
    () => {
      setMeta(
        (current) => ({
          ...current,

          page:
            Math.min(
              current.totalPages,
              current.page + 1
            ),
        })
      );
    };

  const handleDeactivate =
    async (product) => {
      const confirmed =
        window.confirm(
          `¿Desactivar "${product.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoadingId(
          product.id
        );

        setError('');

        await deactivateProductApi(
          product.id
        );

        setReloadKey(
          (current) =>
            current + 1
        );
      } catch (
        requestError
      ) {
        setError(
          requestError?.message ||
            'No se ha podido desactivar el producto'
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };

  const handleRestore =
    async (product) => {
      try {
        setActionLoadingId(
          product.id
        );

        setError('');

        await restoreProductApi(
          product.id
        );

        setReloadKey(
          (current) =>
            current + 1
        );
      } catch (
        requestError
      ) {
        setError(
          requestError?.message ||
            'No se ha podido restaurar el producto'
        );
      } finally {
        setActionLoadingId(
          null
        );
      }
    };

  const hasActiveFilters =
    Boolean(
      search ||
      appliedSearch ||
      category ||
      status ||
      stock
    );

  return (
    <section>
      <div
        className={
          styles.header
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Catálogo
          </p>

          <h2
            className={
              styles.title
            }
          >
            Productos
          </h2>

          <p
            className={
              styles.description
            }
          >
            Gestiona productos
            activos e inactivos
            del catálogo.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className={
            styles.primaryButton
          }
        >
          Nuevo producto
        </Link>
      </div>

      <div
        className={
          styles.searchForm
        }
      >
        <label
          htmlFor="admin-product-search"
          className={
            styles.srOnly
          }
        >
          Buscar productos
        </label>

        <input
          id="admin-product-search"
          type="search"
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Buscar por nombre o descripción"
          className={
            styles.searchInput
          }
        />

        <label
          htmlFor="admin-product-category"
          className={
            styles.srOnly
          }
        >
          Filtrar por categoría
        </label>

        <select
          id="admin-product-category"
          value={category}
          onChange={
            handleCategoryChange
          }
          className={
            styles.searchInput
          }
        >
          <option value="">
            Todas las categorías
          </option>

          {CATEGORY_OPTIONS.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>

        <label
          htmlFor="admin-product-status"
          className={
            styles.srOnly
          }
        >
          Filtrar por estado
        </label>

        <select
          id="admin-product-status"
          value={status}
          onChange={
            handleStatusChange
          }
          className={
            styles.searchInput
          }
        >
          <option value="">
            Todos los estados
          </option>

          <option value="active">
            Activos
          </option>

          <option value="inactive">
            Inactivos
          </option>
        </select>

        <label
          htmlFor="admin-product-stock"
          className={
            styles.srOnly
          }
        >
          Filtrar por stock
        </label>

        <select
          id="admin-product-stock"
          value={stock}
          onChange={
            handleStockChange
          }
          className={
            styles.searchInput
          }
        >
          <option value="">
            Todo el stock
          </option>

          <option value="inStock">
            Con stock
          </option>

          <option value="lowStock">
            Stock bajo
          </option>

          <option value="outOfStock">
            Agotados
          </option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={
              handleClearFilters
            }
          >
            Limpiar
          </button>
        )}
      </div>

      {error && (
        <div
          className={
            styles.error
          }
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p
          className={
            styles.stateMessage
          }
        >
          Cargando productos...
        </p>
      ) : products.length ===
        0 ? (
        <p
          className={
            styles.stateMessage
          }
        >
          No se han encontrado
          productos con los filtros
          seleccionados.
        </p>
      ) : (
        <>
          <div
            className={
              styles.tableWrapper
            }
          >
            <table
              className={
                styles.table
              }
            >
              <thead>
                <tr>
                  <th>
                    Producto
                  </th>

                  <th>
                    Categoría
                  </th>

                  <th>
                    Precio
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => (
                    <tr
                      key={
                        product.id
                      }
                    >
                      <td>
                        <div
                          className={
                            styles.productCell
                          }
                        >
                          {product
                            .images?.[0] && (
                            <img
                              src={
                                product
                                  .images[0]
                              }
                              alt=""
                              className={
                                styles.thumbnail
                              }
                            />
                          )}

                          <div>
                            <strong>
                              {
                                product.name
                              }
                            </strong>

                            <span
                              className={
                                styles.productId
                              }
                            >
                              ID{' '}
                              {
                                product.id
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {product.category ||
                          '—'}
                      </td>

                      <td>
                        {product.price}{' '}
                        €
                      </td>

                      <td>
                        {
                          product.stock
                        }
                      </td>

                      <td>
                        <span
                          className={
                            product.isActive
                              ? styles.activeBadge
                              : styles.inactiveBadge
                          }
                        >
                          {product.isActive
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div
                          className={
                            styles.rowActions
                          }
                        >
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className={
                              styles.editButton
                            }
                          >
                            Editar
                          </Link>

                          {product.isActive ? (
                            <button
                              type="button"
                              className={
                                styles.dangerButton
                              }
                              disabled={
                                actionLoadingId ===
                                product.id
                              }
                              onClick={() =>
                                handleDeactivate(
                                  product
                                )
                              }
                            >
                              Desactivar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={
                                styles.restoreButton
                              }
                              disabled={
                                actionLoadingId ===
                                product.id
                              }
                              onClick={() =>
                                handleRestore(
                                  product
                                )
                              }
                            >
                              Restaurar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div
            className={
              styles.pagination
            }
          >
            <p>
              {meta.total}{' '}
              {meta.total === 1
                ? 'producto'
                : 'productos'}
            </p>

            <div
              className={
                styles.paginationActions
              }
            >
              <button
                type="button"
                onClick={
                  handlePreviousPage
                }
                disabled={
                  meta.page <= 1
                }
                className={
                  styles.secondaryButton
                }
              >
                Anterior
              </button>

              <span>
                Página {meta.page}
                {meta.totalPages >
                0
                  ? ` de ${meta.totalPages}`
                  : ''}
              </span>

              <button
                type="button"
                onClick={
                  handleNextPage
                }
                disabled={
                  meta.totalPages ===
                    0 ||
                  meta.page >=
                    meta.totalPages
                }
                className={
                  styles.secondaryButton
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminProducts;
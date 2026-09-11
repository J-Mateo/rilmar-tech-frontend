import {
  useEffect,
  useState,
} from 'react';

import {
  Search,
} from 'lucide-react';

import {
  getAdminOrdersApi,
} from '../../api/orders.api';

import formatCurrency from '../../utils/formatCurrency';

import styles from './AdminOrders.module.css';

const SEARCH_DEBOUNCE_MS = 350;

const STATUS_OPTIONS = [
  {
    value: '',
    label: 'Todos los estados',
  },
  {
    value: 'PENDING',
    label: 'Pendientes',
  },
  {
    value: 'PAID',
    label: 'Pagados',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelados',
  },
  {
    value: 'REFUNDED',
    label: 'Reembolsados',
  },
];

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

const formatDate = (
  value
) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'es-ES',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(
    new Date(value)
  );
};

const getUnitsCount = (
  order
) =>
  Array.isArray(order.items)
    ? order.items.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.quantity || 0
          ),
        0
      )
    : 0;

const AdminOrders = () => {
  const [
    orders,
    setOrders,
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
    appliedSearch,
    setAppliedSearch,
  ] = useState('');

  const [
    status,
    setStatus,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        setMeta(
          (current) => ({
            ...current,
            page: 1,
          })
        );

        setAppliedSearch(
          search.trim()
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

    const loadOrders =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await getAdminOrdersApi(
              {
                page: meta.page,
                limit: meta.limit,
                search:
                  appliedSearch,
                status,
              },
              {
                signal:
                  controller.signal,
              }
            );

          setOrders(
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
              'No se han podido cargar los pedidos'
          );
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    loadOrders();

    return () => {
      controller.abort();
    };
  }, [
    meta.page,
    meta.limit,
    appliedSearch,
    status,
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

  const handleStatusChange =
    (event) => {
      resetToFirstPage();

      setStatus(
        event.target.value
      );
    };

  const handleClearFilters =
    () => {
      setSearch('');
      setAppliedSearch('');
      setStatus('');

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

  const hasActiveFilters =
    Boolean(
      search ||
      appliedSearch ||
      status
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
            Administración
          </p>

          <h1
            className={
              styles.title
            }
          >
            Pedidos
          </h1>

          <p
            className={
              styles.description
            }
          >
            Consulta los pedidos
            realizados en la tienda.
          </p>
        </div>
      </div>

      <div
        className={
          styles.filters
        }
      >
        <div
          className={
            styles.searchWrapper
          }
        >
          <Search
            size={18}
            aria-hidden="true"
            className={
              styles.searchIcon
            }
          />

          <input
            type="search"
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Pedido, cliente o email"
            className={
              styles.searchInput
            }
            aria-label="Buscar pedidos"
          />
        </div>

        <select
          value={status}
          onChange={
            handleStatusChange
          }
          className={
            styles.select
          }
          aria-label="Filtrar pedidos por estado"
        >
          {STATUS_OPTIONS.map(
            (option) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {option.label}
              </option>
            )
          )}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className={
              styles.clearButton
            }
            onClick={
              handleClearFilters
            }
          >
            Limpiar filtros
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
          Cargando pedidos...
        </p>
      ) : orders.length ===
        0 ? (
        <p
          className={
            styles.stateMessage
          }
        >
          No hay pedidos que
          coincidan con los filtros.
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
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {orders.map(
                  (order) => (
                    <tr
                      key={
                        order.id
                      }
                    >
                      <td>
                        <strong
                          className={
                            styles.orderId
                          }
                        >
                          #{order.id}
                        </strong>
                      </td>

                      <td>
                        <div
                          className={
                            styles.customer
                          }
                        >
                          <strong>
                            {order.user
                              ?.name ||
                              'Usuario'}
                          </strong>

                          <span>
                            {order.user
                              ?.email ||
                              '—'}
                          </span>
                        </div>
                      </td>

                      <td>
                        {formatDate(
                          order.createdAt
                        )}
                      </td>

                      <td>
                        {getUnitsCount(
                          order
                        )}{' '}
                        uds.
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            order.total
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[
                              `status${order.status}`
                            ] || ''
                          }`}
                        >
                          {STATUS_LABELS[
                            order.status
                          ] ||
                            order.status}
                        </span>
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
                ? 'pedido'
                : 'pedidos'}
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
                  styles.paginationButton
                }
              >
                Anterior
              </button>

              <span>
                Página {meta.page}
                {meta.totalPages >
                  0 &&
                  ` de ${meta.totalPages}`}
              </span>

              <button
                type="button"
                onClick={
                  handleNextPage
                }
                disabled={
                  meta.page >=
                  meta.totalPages
                }
                className={
                  styles.paginationButton
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

export default AdminOrders;
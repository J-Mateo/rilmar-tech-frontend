import {
  useEffect,
  useState,
} from 'react';

import {
  Search,
} from 'lucide-react';

import {
  getAdminUsersApi,
} from '../../api/users.api';

import styles from './AdminUsers.module.css';

const SEARCH_DEBOUNCE_MS = 350;

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
    }
  ).format(
    new Date(value)
  );
};

const AdminUsers = () => {
  const [
    users,
    setUsers,
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
    role,
    setRole,
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

    const loadUsers =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await getAdminUsersApi(
              {
                page: meta.page,
                limit: meta.limit,
                search:
                  appliedSearch,
                role,
              },
              {
                signal:
                  controller.signal,
              }
            );

          setUsers(
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
              'No se han podido cargar los usuarios'
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

    loadUsers();

    return () => {
      controller.abort();
    };
  }, [
    meta.page,
    meta.limit,
    appliedSearch,
    role,
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

  const handleRoleChange =
    (event) => {
      resetToFirstPage();

      setRole(
        event.target.value
      );
    };

  const handleClearFilters =
    () => {
      setSearch('');
      setAppliedSearch('');
      setRole('');

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
      role
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
            Usuarios
          </h1>

          <p
            className={
              styles.description
            }
          >
            Consulta los usuarios
            registrados y su
            actividad de pedidos.
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
            placeholder="Nombre o email"
            className={
              styles.searchInput
            }
            aria-label="Buscar usuarios"
          />
        </div>

        <select
          value={role}
          onChange={
            handleRoleChange
          }
          className={
            styles.select
          }
          aria-label="Filtrar usuarios por rol"
        >
          <option value="">
            Todos los roles
          </option>

          <option value="USER">
            Usuarios
          </option>

          <option value="ADMIN">
            Administradores
          </option>
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
          Cargando usuarios...
        </p>
      ) : users.length ===
        0 ? (
        <p
          className={
            styles.stateMessage
          }
        >
          No hay usuarios que
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
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Pedidos</th>
                  <th>Registro</th>
                </tr>
              </thead>

              <tbody>
                {users.map(
                  (user) => (
                    <tr
                      key={
                        user.id
                      }
                    >
                      <td>
                        <div
                          className={
                            styles.userCell
                          }
                        >
                          <div
                            className={
                              styles.avatar
                            }
                            aria-hidden="true"
                          >
                            {user.name
                              ?.trim()
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              '?'}
                          </div>

                          <div>
                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              ID #{user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        <span
                          className={
                            user.role ===
                            'ADMIN'
                              ? styles.adminBadge
                              : styles.userBadge
                          }
                        >
                          {user.role ===
                          'ADMIN'
                            ? 'Administrador'
                            : 'Usuario'}
                        </span>
                      </td>

                      <td>
                        {user.ordersCount ??
                          0}
                      </td>

                      <td>
                        {formatDate(
                          user.createdAt
                        )}
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
                ? 'usuario'
                : 'usuarios'}
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

export default AdminUsers;
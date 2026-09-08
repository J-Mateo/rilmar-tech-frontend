import {
  CalendarDays,
  Heart,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  getOrdersApi,
} from '../api/orders.api';

import Button from '../components/common/Button/Button';

import {
  logoutUser,
} from '../store/slices/authSlice';

import {
  clearWishlist,
} from '../store/slices/wishlistSlice';

import styles from './ProfilePage.module.css';

const formatDate = (value) => {
  if (!value) {
    return 'No disponible';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'No disponible';
  }

  return new Intl.DateTimeFormat(
    'es-ES',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  ).format(date);
};

const formatPrice = (value) => {
  const amount =
    Number(value);

  if (
    !Number.isFinite(amount)
  ) {
    return '—';
  }

  return new Intl.NumberFormat(
    'es-ES',
    {
      style: 'currency',
      currency: 'EUR',
    }
  ).format(amount);
};

const getRoleLabel = (role) => {
  if (role === 'ADMIN') {
    return 'Administrador';
  }

  return 'Usuario';
};

const getOrderStatus = (status) => {
  switch (status) {
    case 'PAID':
      return {
        label: 'Pagado',
        className:
          styles.statusPaid,
      };

    case 'PENDING':
      return {
        label: 'Pendiente',
        className:
          styles.statusPending,
      };

    case 'CANCELLED':
      return {
        label: 'Cancelado',
        className:
          styles.statusCancelled,
      };

    default:
      return {
        label:
          status ||
          'Desconocido',
        className:
          styles.statusDefault,
      };
  }
};

const ProfilePage = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    user,
    loading,
  } = useSelector(
    (state) =>
      state.auth
  );

  const {
    productIds,
  } = useSelector(
    (state) =>
      state.wishlist
  );

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    ordersLoading,
    setOrdersLoading,
  ] = useState(true);

  const [
    ordersError,
    setOrdersError,
  ] = useState('');

  const fetchOrders =
    useCallback(
      async () => {
        const response =
          await getOrdersApi();

        return Array.isArray(
          response?.data?.orders
        )
          ? response.data.orders
          : [];
      },
      []
    );

  const loadOrders =
    useCallback(
      async () => {
        setOrdersLoading(true);
        setOrdersError('');

        try {
          const nextOrders =
            await fetchOrders();

          setOrders(
            nextOrders
          );
        } catch {
          setOrdersError(
            'No hemos podido cargar tus pedidos.'
          );
        } finally {
          setOrdersLoading(false);
        }
      },
      [
        fetchOrders,
      ]
    );

  useEffect(
    () => {
      let active = true;

      const loadInitialOrders =
        async () => {
          try {
            const nextOrders =
              await fetchOrders();

            if (!active) {
              return;
            }

            setOrders(
              nextOrders
            );
          } catch {
            if (!active) {
              return;
            }

            setOrdersError(
              'No hemos podido cargar tus pedidos.'
            );
          } finally {
            if (active) {
              setOrdersLoading(
                false
              );
            }
          }
        };

      loadInitialOrders();

      return () => {
        active = false;
      };
    },
    [
      fetchOrders,
    ]
  );

  const handleLogout =
    async () => {
      try {
        await dispatch(
          logoutUser()
        ).unwrap();

        dispatch(
          clearWishlist()
        );

        navigate(
          '/login',
          {
            replace: true,
          }
        );
      } catch {
        return;
      }
    };

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.container
        }
      >
        <section
          className={
            styles.headerSection
          }
        >
          <div>
            <p
              className={
                styles.eyebrow
              }
            >
              Mi cuenta
            </p>

            <h1
              className={
                styles.title
              }
            >
              Mi perfil
            </h1>

            <p
              className={
                styles.subtitle
              }
            >
              Consulta la información asociada a tu cuenta y tus pedidos.
            </p>
          </div>

          <div
            className={
              styles.statusBadge
            }
          >
            <span
              className={
                styles.statusDot
              }
            />
            Sesión activa
          </div>
        </section>

        <div
          className={
            styles.contentGrid
          }
        >
          <section
            className={
              styles.profileCard
            }
          >
            <div
              className={
                styles.avatar
              }
            >
              <UserRound
                size={34}
              />
            </div>

            <div
              className={
                styles.identity
              }
            >
              <h2
                className={
                  styles.userName
                }
              >
                {user?.name ||
                  'Usuario'}
              </h2>

              <p
                className={
                  styles.userEmail
                }
              >
                {user?.email}
              </p>
            </div>

            <div
              className={
                styles.details
              }
            >
              <div
                className={
                  styles.detailRow
                }
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <Mail
                    size={18}
                  />
                </div>

                <div>
                  <span
                    className={
                      styles.detailLabel
                    }
                  >
                    Correo electrónico
                  </span>

                  <p
                    className={
                      styles.detailValue
                    }
                  >
                    {user?.email ||
                      'No disponible'}
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.detailRow
                }
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <ShieldCheck
                    size={18}
                  />
                </div>

                <div>
                  <span
                    className={
                      styles.detailLabel
                    }
                  >
                    Rol
                  </span>

                  <p
                    className={
                      styles.detailValue
                    }
                  >
                    {getRoleLabel(
                      user?.role
                    )}
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.detailRow
                }
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <CalendarDays
                    size={18}
                  />
                </div>

                <div>
                  <span
                    className={
                      styles.detailLabel
                    }
                  >
                    Miembro desde
                  </span>

                  <p
                    className={
                      styles.detailValue
                    }
                  >
                    {formatDate(
                      user
                        ?.createdAt
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside
            className={
              styles.sideColumn
            }
          >
            <section
              className={
                styles.actionCard
              }
            >
              <div
                className={
                  styles.actionHeader
                }
              >
                <Heart
                  size={20}
                />

                <div>
                  <h2
                    className={
                      styles.actionTitle
                    }
                  >
                    Lista de deseos
                  </h2>

                  <p
                    className={
                      styles.actionText
                    }
                  >
                    {productIds.length ===
                    1
                      ? 'Tienes 1 producto guardado.'
                      : `Tienes ${productIds.length} productos guardados.`}
                  </p>
                </div>
              </div>

              <Link
                to="/wishlist"
                className={
                  styles.secondaryAction
                }
              >
                Ver lista de deseos
              </Link>
            </section>

            <section
              className={
                styles.actionCard
              }
            >
              <div
                className={
                  styles.actionHeader
                }
              >
                <LogOut
                  size={20}
                />

                <div>
                  <h2
                    className={
                      styles.actionTitle
                    }
                  >
                    Cerrar sesión
                  </h2>

                  <p
                    className={
                      styles.actionText
                    }
                  >
                    Finaliza la sesión actual de forma segura.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={
                  handleLogout
                }
                isLoading={
                  loading
                }
                className={
                  styles.logoutButton
                }
              >
                Cerrar sesión
              </Button>
            </section>
          </aside>
        </div>

        <section
          className={
            styles.ordersSection
          }
        >
          <div
            className={
              styles.ordersHeader
            }
          >
            <div>
              <p
                className={
                  styles.ordersEyebrow
                }
              >
                Historial
              </p>

              <h2
                className={
                  styles.ordersTitle
                }
              >
                Mis pedidos
              </h2>

              <p
                className={
                  styles.ordersSubtitle
                }
              >
                Consulta tus compras y el estado de cada pedido.
              </p>
            </div>

            {!ordersLoading &&
              !ordersError &&
              orders.length >
                0 && (
                <span
                  className={
                    styles.ordersCount
                  }
                >
                  {orders.length ===
                  1
                    ? '1 pedido'
                    : `${orders.length} pedidos`}
                </span>
              )}
          </div>

          {ordersLoading && (
            <div
              className={
                styles.ordersState
              }
            >
              <RefreshCw
                size={24}
                className={
                  styles.loadingIcon
                }
              />

              <p>
                Cargando tus pedidos...
              </p>
            </div>
          )}

          {!ordersLoading &&
            ordersError && (
              <div
                className={
                  styles.ordersState
                }
              >
                <Package
                  size={28}
                />

                <p>
                  {ordersError}
                </p>

                <Button
                  type="button"
                  variant="primary"
                  onClick={
                    loadOrders
                  }
                >
                  Reintentar
                </Button>
              </div>
            )}

          {!ordersLoading &&
            !ordersError &&
            orders.length ===
              0 && (
              <div
                className={
                  styles.ordersState
                }
              >
                <ShoppingBag
                  size={30}
                />

                <h3>
                  Todavía no tienes pedidos
                </h3>

                <p>
                  Cuando realices una compra, aparecerá aquí.
                </p>

                <Link
                  to="/products"
                  className={
                    styles.shopAction
                  }
                >
                  Explorar productos
                </Link>
              </div>
            )}

          {!ordersLoading &&
            !ordersError &&
            orders.length >
              0 && (
              <div
                className={
                  styles.ordersList
                }
              >
                {orders.map(
                  (order) => {
                    const status =
                      getOrderStatus(
                        order.status
                      );

                    return (
                      <article
                        key={
                          order.id
                        }
                        className={
                          styles.orderCard
                        }
                      >
                        <div
                          className={
                            styles.orderSummary
                          }
                        >
                          <div>
                            <span
                              className={
                                styles.orderLabel
                              }
                            >
                              Pedido
                            </span>

                            <h3
                              className={
                                styles.orderNumber
                              }
                            >
                              #{order.id}
                            </h3>
                          </div>

                          <div
                            className={
                              styles.orderMeta
                            }
                          >
                            <div>
                              <span
                                className={
                                  styles.orderLabel
                                }
                              >
                                Fecha
                              </span>

                              <p>
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>
                            </div>

                            <div>
                              <span
                                className={
                                  styles.orderLabel
                                }
                              >
                                Total
                              </span>

                              <p
                                className={
                                  styles.orderTotal
                                }
                              >
                                {formatPrice(
                                  order.total
                                )}
                              </p>
                            </div>

                            <span
                              className={`${styles.orderStatus} ${status.className}`}
                            >
                              {
                                status.label
                              }
                            </span>
                          </div>
                        </div>

                        <div
                          className={
                            styles.orderItems
                          }
                        >
                          {order.items?.map(
                            (
                              item
                            ) => (
                              <div
                                key={
                                  item.id
                                }
                                className={
                                  styles.orderItem
                                }
                              >
                                <div
                                  className={
                                    styles.productImage
                                  }
                                >
                                  {item.productImage ? (
                                    <img
                                      src={
                                        item.productImage
                                      }
                                      alt={
                                        item.productName
                                      }
                                    />
                                  ) : (
                                    <Package
                                      size={
                                        24
                                      }
                                    />
                                  )}
                                </div>

                                <div
                                  className={
                                    styles.productInfo
                                  }
                                >
                                  <p
                                    className={
                                      styles.productName
                                    }
                                  >
                                    {
                                      item.productName
                                    }
                                  </p>

                                  <p
                                    className={
                                      styles.productMeta
                                    }
                                  >
                                    Cantidad:{' '}
                                    {
                                      item.quantity
                                    }
                                  </p>
                                </div>

                                <p
                                  className={
                                    styles.productPrice
                                  }
                                >
                                  {formatPrice(
                                    item.priceAtPurchase
                                  )}

                                  <span>
                                    {' '}
                                    ×{' '}
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
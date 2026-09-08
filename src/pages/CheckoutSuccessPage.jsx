import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShoppingBag,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  getCheckoutOrderApi,
} from '../api/payments.api';

import styles from './CheckoutSuccessPage.module.css';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/140x140?text=Sin+imagen';

const currencyFormatter =
  new Intl.NumberFormat(
    'es-ES',
    {
      style: 'currency',
      currency: 'EUR',
    }
  );

const dateFormatter =
  new Intl.DateTimeFormat(
    'es-ES',
    {
      dateStyle: 'long',
      timeStyle: 'short',
    }
  );

const MAX_STATUS_ATTEMPTS =
  8;

const STATUS_RETRY_DELAY =
  1500;

const CheckoutSuccessPage =
  () => {
    const [
      searchParams,
    ] =
      useSearchParams();

    const sessionId =
      searchParams.get(
        'session_id'
      );

    const [
      order,
      setOrder,
    ] =
      useState(null);

    const [
      loading,
      setLoading,
    ] =
      useState(true);

    const [
      error,
      setError,
    ] =
      useState(null);

    const [
      attempts,
      setAttempts,
    ] =
      useState(0);

    const loadOrder =
      useCallback(
        async () => {
          if (!sessionId) {
            setLoading(false);

            setError(
              'No se ha recibido una sesión de pago válida.'
            );

            return;
          }

          try {
            const response =
              await getCheckoutOrderApi(
                sessionId
              );

            const fetchedOrder =
              response.data;

            setOrder(
              fetchedOrder
            );

            setError(null);
          } catch (requestError) {
            setError(
              requestError
                ?.message ||
                'No se ha podido comprobar el estado del pedido.'
            );
          } finally {
            setLoading(false);
          }
        },
        [
          sessionId,
        ]
      );

    useEffect(
      () => {
        let timeoutId;
        let cancelled =
          false;

        const checkOrder =
          async () => {
            if (
              cancelled ||
              !sessionId
            ) {
              return;
            }

            try {
              const response =
                await getCheckoutOrderApi(
                  sessionId
                );

              if (cancelled) {
                return;
              }

              const fetchedOrder =
                response.data;

              setOrder(
                fetchedOrder
              );

              setError(null);
              setLoading(false);

              if (
                fetchedOrder
                  ?.status ===
                  'PENDING' &&
                attempts <
                  MAX_STATUS_ATTEMPTS
              ) {
                timeoutId =
                  window.setTimeout(
                    () => {
                      setAttempts(
                        (
                          current
                        ) =>
                          current +
                          1
                      );
                    },
                    STATUS_RETRY_DELAY
                  );
              }
            } catch (
              requestError
            ) {
              if (cancelled) {
                return;
              }

              setLoading(false);

              setError(
                requestError
                  ?.message ||
                  'No se ha podido comprobar el estado del pedido.'
              );
            }
          };

        checkOrder();

        return () => {
          cancelled =
            true;

          if (timeoutId) {
            window.clearTimeout(
              timeoutId
            );
          }
        };
      },
      [
        attempts,
        sessionId,
      ]
    );

    if (loading) {
      return (
        <main
          className={
            styles.page
          }
        >
          <section
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.iconWrapper
              }
            >
              <Clock3
                size={34}
                aria-hidden="true"
              />
            </div>

            <h1
              className={
                styles.title
              }
            >
              Comprobando tu pago
            </h1>

            <p
              className={
                styles.message
              }
            >
              Estamos confirmando el estado del pedido de forma segura.
            </p>
          </section>
        </main>
      );
    }

    if (
      error ||
      !sessionId
    ) {
      return (
        <main
          className={
            styles.page
          }
        >
          <section
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.iconWrapperError
              }
            >
              <AlertTriangle
                size={34}
                aria-hidden="true"
              />
            </div>

            <h1
              className={
                styles.title
              }
            >
              No hemos podido comprobar el pedido
            </h1>

            <p
              className={
                styles.message
              }
            >
              {error ||
                'La sesión de pago no es válida.'}
            </p>

            <button
              type="button"
              className={
                styles.retryButton
              }
              onClick={
                loadOrder
              }
            >
              Volver a comprobar
            </button>

            <Link
              to="/products"
              className={
                styles.secondaryLink
              }
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      );
    }

    if (!order) {
      return (
        <main
          className={
            styles.page
          }
        >
          <section
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.iconWrapper
              }
            >
              <ShoppingBag
                size={34}
                aria-hidden="true"
              />
            </div>

            <h1
              className={
                styles.title
              }
            >
              Pedido no disponible
            </h1>

            <p
              className={
                styles.message
              }
            >
              No hemos podido recuperar los datos de esta compra.
            </p>

            <Link
              to="/products"
              className={
                styles.primaryLink
              }
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      );
    }

    if (
      order.status ===
      'PENDING'
    ) {
      return (
        <main
          className={
            styles.page
          }
        >
          <section
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.iconWrapperPending
              }
            >
              <Clock3
                size={34}
                aria-hidden="true"
              />
            </div>

            <p
              className={
                styles.eyebrowPending
              }
            >
              Pago en verificación
            </p>

            <h1
              className={
                styles.title
              }
            >
              Estamos confirmando tu pedido
            </h1>

            <p
              className={
                styles.message
              }
            >
              Stripe ha devuelto el control a Rilmar Tech, pero el backend todavía está esperando la confirmación definitiva del pago.
            </p>

            <p
              className={
                styles.pendingHint
              }
            >
              No vuelvas a realizar el pago. La confirmación puede tardar unos segundos.
            </p>

            <button
              type="button"
              className={
                styles.retryButton
              }
              onClick={
                loadOrder
              }
            >
              Comprobar de nuevo
            </button>
          </section>
        </main>
      );
    }

    if (
      order.status !==
      'PAID'
    ) {
      return (
        <main
          className={
            styles.page
          }
        >
          <section
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.iconWrapperError
              }
            >
              <AlertTriangle
                size={34}
                aria-hidden="true"
              />
            </div>

            <h1
              className={
                styles.title
              }
            >
              El pedido no está pagado
            </h1>

            <p
              className={
                styles.message
              }
            >
              El pedido se encuentra actualmente en estado {order.status}.
            </p>

            <Link
              to="/products"
              className={
                styles.primaryLink
              }
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      );
    }

    const items =
      Array.isArray(
        order.items
      )
        ? order.items
        : [];

    return (
      <main
        className={
          styles.page
        }
      >
        <section
          className={
            styles.successCard
          }
        >
          <div
            className={
              styles.iconWrapperSuccess
            }
          >
            <CheckCircle2
              size={38}
              aria-hidden="true"
            />
          </div>

          <p
            className={
              styles.eyebrow
            }
          >
            Pedido confirmado
          </p>

          <h1
            className={
              styles.title
            }
          >
            ¡Compra realizada con éxito!
          </h1>

          <p
            className={
              styles.message
            }
          >
            Stripe ha confirmado el pago y tu pedido ha quedado registrado correctamente.
          </p>

          <div
            className={
              styles.orderMeta
            }
          >
            <div>
              <span
                className={
                  styles.metaLabel
                }
              >
                Pedido
              </span>

              <strong
                className={
                  styles.metaValue
                }
              >
                #{order.id}
              </strong>
            </div>

            <div>
              <span
                className={
                  styles.metaLabel
                }
              >
                Fecha
              </span>

              <strong
                className={
                  styles.metaValue
                }
              >
                {order.createdAt
                  ? dateFormatter.format(
                      new Date(
                        order.createdAt
                      )
                    )
                  : 'No disponible'}
              </strong>
            </div>
          </div>

          <div
            className={
              styles.divider
            }
          />

          <section
            className={
              styles.orderItems
            }
            aria-labelledby="order-items-title"
          >
            <h2
              id="order-items-title"
              className={
                styles.sectionTitle
              }
            >
              Productos
            </h2>

            <div
              className={
                styles.items
              }
            >
              {items.map(
                (item) => {
                  const image =
                    item.productImage ||
                    FALLBACK_IMAGE;

                  const productName =
                    item.productName ||
                    'Producto';

                  const quantity =
                    Number(
                      item.quantity ||
                        0
                    );

                  const priceAtPurchase =
                    Number(
                      item.priceAtPurchase ||
                        0
                    );

                  const subtotal =
                    quantity *
                    priceAtPurchase;

                  return (
                    <article
                      key={
                        item.id
                      }
                      className={
                        styles.item
                      }
                    >
                      <img
                        src={
                          image
                        }
                        alt={
                          productName
                        }
                        className={
                          styles.image
                        }
                      />

                      <div
                        className={
                          styles.itemInfo
                        }
                      >
                        <h3
                          className={
                            styles.productName
                          }
                        >
                          {
                            productName
                          }
                        </h3>

                        <p
                          className={
                            styles.itemMeta
                          }
                        >
                          {
                            quantity
                          }{' '}
                          ×{' '}
                          {currencyFormatter.format(
                            priceAtPurchase
                          )}
                        </p>
                      </div>

                      <strong
                        className={
                          styles.itemSubtotal
                        }
                      >
                        {currencyFormatter.format(
                          subtotal
                        )}
                      </strong>
                    </article>
                  );
                }
              )}
            </div>
          </section>

          <div
            className={
              styles.divider
            }
          />

          <div
            className={
              styles.totalRow
            }
          >
            <span>
              Total pagado
            </span>

            <strong>
              {currencyFormatter.format(
                Number(
                  order.total ||
                    0
                )
              )}
            </strong>
          </div>

          <div
            className={
              styles.actions
            }
          >
            <Link
              to="/products"
              className={
                styles.primaryLink
              }
            >
              Seguir comprando
            </Link>

            <Link
              to="/profile"
              className={
                styles.secondaryLink
              }
            >
              Ir a mi perfil
            </Link>
          </div>
        </section>
      </main>
    );
  };

export default CheckoutSuccessPage;
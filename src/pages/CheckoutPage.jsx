import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  checkoutBuyNow,
  checkoutCart,
  clearBuyNow,
  selectBuyNowItem,
  selectCartError,
  selectCartItems,
  selectCartTotal,
  selectCheckoutLoading,
  selectCheckoutMode,
} from '../store/slices/cartSlice';

import Button from '../components/common/Button/Button';

import styles from './CheckoutPage.module.css';

const currencyFormatter =
  new Intl.NumberFormat(
    'es-ES',
    {
      style: 'currency',
      currency: 'EUR',
    }
  );

const FALLBACK_IMAGE =
  'https://via.placeholder.com/160x160?text=Sin+imagen';

const CheckoutPage = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const cartItems =
    useSelector(
      selectCartItems
    );

  const cartTotal =
    useSelector(
      selectCartTotal
    );

  const buyNowItem =
    useSelector(
      selectBuyNowItem
    );

  const checkoutMode =
    useSelector(
      selectCheckoutMode
    );

  const checkoutLoading =
    useSelector(
      selectCheckoutLoading
    );

  const error =
    useSelector(
      selectCartError
    );

  const isBuyNow =
    checkoutMode ===
      'buyNow' &&
    Boolean(
      buyNowItem?.product
    );

  const items =
    isBuyNow
      ? [
          {
            id:
              `buy-now-${buyNowItem.product.id}`,

            product:
              buyNowItem.product,

            quantity:
              buyNowItem.quantity,
          },
        ]
      : cartItems;

  const total =
    isBuyNow
      ? Number(
          buyNowItem
            .product
            .price || 0
        ) *
        Number(
          buyNowItem
            .quantity || 1
        )
      : cartTotal;

  const handleCheckout =
    async () => {
      if (
        items.length === 0 ||
        checkoutLoading
      ) {
        return;
      }

      try {
        if (isBuyNow) {
          await dispatch(
            checkoutBuyNow({
              productId:
                buyNowItem
                  .product.id,

              quantity:
                buyNowItem
                  .quantity,
            })
          ).unwrap();
        } else {
          await dispatch(
            checkoutCart()
          ).unwrap();
        }

        navigate(
          '/checkout/success',
          {
            replace: true,
          }
        );
      } catch {
        return;
      }
    };

  const handleBack =
    () => {
      if (isBuyNow) {
        dispatch(
          clearBuyNow()
        );
      }
    };

  if (
    items.length === 0
  ) {
    return (
      <main
        className={
          styles.page
        }
      >
        <section
          className={
            styles.empty
          }
        >
          <div
            className={
              styles.emptyIcon
            }
          >
            <ShoppingBag
              size={32}
              aria-hidden="true"
            />
          </div>

          <h1
            className={
              styles.emptyTitle
            }
          >
            No hay productos para tramitar
          </h1>

          <p
            className={
              styles.emptyText
            }
          >
            Añade productos al carrito o selecciona Comprar ahora.
          </p>

          <Link
            to="/products"
            className={
              styles.catalogLink
            }
          >
            Ver catálogo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <header
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
            Último paso
          </p>

          <h1
            className={
              styles.title
            }
          >
            Proceso de Pago
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            {isBuyNow
              ? 'Revisa el producto antes de confirmar la compra.'
              : 'Revisa tu pedido antes de confirmar la compra.'}
          </p>
        </div>

        <CheckCircle2
          size={32}
          className={
            styles.headerIcon
          }
          aria-hidden="true"
        />
      </header>

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

      <div
        className={
          styles.layout
        }
      >
        <section
          className={
            styles.order
          }
          aria-labelledby="checkout-order-title"
        >
          <h2
            id="checkout-order-title"
            className={
              styles.sectionTitle
            }
          >
            Tu pedido
          </h2>

          <div
            className={
              styles.items
            }
          >
            {items.map(
              (item) => {
                const product =
                  item.product;

                const price =
                  Number(
                    product
                      ?.price ||
                      0
                  );

                const quantity =
                  Number(
                    item.quantity ||
                      0
                  );

                const subtotal =
                  price *
                  quantity;

                const image =
                  Array.isArray(
                    product
                      ?.images
                  ) &&
                  product.images
                    .length > 0
                    ? product
                        .images[0]
                    : FALLBACK_IMAGE;

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
                      src={image}
                      alt={
                        product
                          ?.name ||
                        'Producto'
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
                          product
                            ?.name
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
                          price
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

        <aside
          className={
            styles.summary
          }
        >
          <h2
            className={
              styles.sectionTitle
            }
          >
            Resumen
          </h2>

          <div
            className={
              styles.summaryRow
            }
          >
            <span>
              Productos
            </span>

            <span>
              {currencyFormatter.format(
                total
              )}
            </span>
          </div>

          <div
            className={
              styles.summaryRow
            }
          >
            <span>
              Envío
            </span>

            <span
              className={
                styles.freeShipping
              }
            >
              Gratis
            </span>
          </div>

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
              Total
            </span>

            <strong>
              {currencyFormatter.format(
                total
              )}
            </strong>
          </div>

          <Button
            type="button"
            variant="primary"
            className={
              styles.checkoutButton
            }
            onClick={
              handleCheckout
            }
            isLoading={
              checkoutLoading
            }
            disabled={
              checkoutLoading
            }
          >
            Confirmar compra
          </Button>

          <Link
            to={
              isBuyNow
                ? '/products'
                : '/cart'
            }
            className={
              styles.backLink
            }
            onClick={
              handleBack
            }
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />

            {isBuyNow
              ? 'Volver al catálogo'
              : 'Volver al carrito'}
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
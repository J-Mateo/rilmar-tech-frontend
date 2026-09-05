import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  prepareCartCheckout,
  removeCartItem,
  updateCartItemQuantity,
  selectCartError,
  selectCartItems,
  selectCartLoading,
  selectCartMutationLoading,
  selectCartTotal,
} from '../store/slices/cartSlice';

import styles from './CartPage.module.css';

const currencyFormatter =
  new Intl.NumberFormat(
    'es-ES',
    {
      style: 'currency',
      currency: 'EUR',
    }
  );

const FALLBACK_IMAGE =
  'https://via.placeholder.com/300x300?text=Sin+imagen';

const CartPage = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const items =
    useSelector(
      selectCartItems
    );

  const loading =
    useSelector(
      selectCartLoading
    );

  const mutationLoading =
    useSelector(
      selectCartMutationLoading
    );

  const error =
    useSelector(
      selectCartError
    );

  const total =
    useSelector(
      selectCartTotal
    );

  const handleRemove =
    async (
      itemId
    ) => {
      try {
        await dispatch(
          removeCartItem(
            itemId
          )
        ).unwrap();
      } catch {
        return;
      }
    };

  const handleQuantityChange =
    async ({
      itemId,
      quantity,
    }) => {
      try {
        await dispatch(
          updateCartItemQuantity({
            itemId,
            quantity,
          })
        ).unwrap();
      } catch {
        return;
      }
    };

  const handleCheckout =
    () => {
      /*
       * Indicamos expresamente que
       * entramos desde el carrito.
       *
       * Esto elimina cualquier
       * "Comprar ahora" anterior.
       */
      dispatch(
        prepareCartCheckout()
      );

      navigate(
        '/checkout'
      );
    };

  if (loading) {
    return (
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.stateContainer
          }
        >
          <ShoppingBag
            size={36}
            aria-hidden="true"
          />

          <p>
            Cargando carrito...
          </p>
        </div>
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
            Tu compra
          </p>

          <h1
            className={
              styles.title
            }
          >
            Carrito
          </h1>
        </div>

        <ShoppingBag
          size={30}
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

      {items.length === 0 ? (
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
              size={34}
              aria-hidden="true"
            />
          </div>

          <h2>
            Tu carrito está vacío
          </h2>

          <p>
            Explora nuestro catálogo y añade los productos que quieras comprar.
          </p>

          <Link
            to="/products"
            className={
              styles.primaryLink
            }
          >
            Ver catálogo
          </Link>
        </section>
      ) : (
        <div
          className={
            styles.layout
          }
        >
          <section
            className={
              styles.items
            }
            aria-label="Productos del carrito"
          >
            {items.map(
              (item) => {
                const product =
                  item.product;

                const image =
                  Array.isArray(
                    product?.images
                  ) &&
                  product.images
                    .length > 0
                    ? product
                        .images[0]
                    : FALLBACK_IMAGE;

                const price =
                  Number(
                    product?.price ||
                      0
                  );

                const quantity =
                  Number(
                    item.quantity ||
                      0
                  );

                const stock =
                  Number(
                    product?.stock ||
                      0
                  );

                const subtotal =
                  price *
                  quantity;

                const canDecrease =
                  quantity > 1;

                const canIncrease =
                  quantity <
                  stock;

                return (
                  <article
                    key={
                      item.id
                    }
                    className={
                      styles.item
                    }
                  >
                    <Link
                      to={`/products/${product?.id}`}
                      className={
                        styles.imageLink
                      }
                      aria-label={`Ver ${product?.name || 'producto'}`}
                    >
                      <img
                        src={
                          image
                        }
                        alt={
                          product?.name ||
                          'Producto'
                        }
                        className={
                          styles.image
                        }
                      />
                    </Link>

                    <div
                      className={
                        styles.itemInfo
                      }
                    >
                      <Link
                        to={`/products/${product?.id}`}
                        className={
                          styles.productName
                        }
                      >
                        {
                          product?.name
                        }
                      </Link>

                      {product?.category && (
                        <span
                          className={
                            styles.category
                          }
                        >
                          {
                            product.category
                          }
                        </span>
                      )}

                      <div
                        className={
                          styles.itemMeta
                        }
                      >
                        <span>
                          {currencyFormatter.format(
                            price
                          )}{' '}
                          / unidad
                        </span>

                        <div
                          className={
                            styles.quantityControl
                          }
                          aria-label={`Cantidad de ${product?.name || 'producto'}`}
                        >
                          <span
                            className={
                              styles.quantityLabel
                            }
                          >
                            Cantidad
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange({
                                itemId:
                                  item.id,
                                quantity:
                                  quantity -
                                  1,
                              })
                            }
                            disabled={
                              mutationLoading ||
                              !canDecrease
                            }
                            className={
                              styles.quantityButton
                            }
                            aria-label={`Reducir cantidad de ${product?.name || 'producto'}`}
                          >
                            <Minus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>

                          <span
                            className={
                              styles.quantityValue
                            }
                            aria-live="polite"
                          >
                            {
                              quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange({
                                itemId:
                                  item.id,
                                quantity:
                                  quantity +
                                  1,
                              })
                            }
                            disabled={
                              mutationLoading ||
                              !canIncrease
                            }
                            className={
                              styles.quantityButton
                            }
                            aria-label={`Aumentar cantidad de ${product?.name || 'producto'}`}
                          >
                            <Plus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        styles.itemActions
                      }
                    >
                      <strong
                        className={
                          styles.itemPrice
                        }
                      >
                        {currencyFormatter.format(
                          subtotal
                        )}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item.id
                          )
                        }
                        disabled={
                          mutationLoading
                        }
                        className={
                          styles.removeButton
                        }
                        aria-label={`Eliminar ${product?.name || 'producto'} del carrito`}
                      >
                        <Trash2
                          size={17}
                          aria-hidden="true"
                        />

                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </section>

          <aside
            className={
              styles.summary
            }
          >
            <h2
              className={
                styles.summaryTitle
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

            <button
              type="button"
              onClick={
                handleCheckout
              }
              className={
                styles.checkoutButton
              }
            >
              Continuar

              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </button>

            <Link
              to="/products"
              className={
                styles.continueShopping
              }
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
};

export default CartPage;
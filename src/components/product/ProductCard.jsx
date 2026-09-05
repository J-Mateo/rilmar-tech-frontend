import {
  Bell,
  BellRing,
  Heart,
  PackageX,
  ShoppingCart,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  addCartItem,
  selectCartMutationLoading,
} from '../../store/slices/cartSlice';

import {
  toggleWishlistProduct,
} from '../../store/slices/wishlistSlice';

import {
  cancelRestockAlertApi,
  getRestockAlertApi,
  subscribeRestockAlertApi,
} from '../../api/products.api';

import styles from './ProductCard.module.css';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/400x300?text=Sin+imagen';

const ProductCard = ({
  product,
}) => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    activeCartAction,
    setActiveCartAction,
  ] = useState(null);

  const [
    restockSubscribed,
    setRestockSubscribed,
  ] = useState(false);

  const [
    restockLoading,
    setRestockLoading,
  ] = useState(false);

  const [
    restockInitialized,
    setRestockInitialized,
  ] = useState(false);

  const [
    restockError,
    setRestockError,
  ] = useState('');

  const {
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  const {
    productIds,
    togglingProductId,
  } = useSelector(
    (state) =>
      state.wishlist
  );

  const cartMutationLoading =
    useSelector(
      selectCartMutationLoading
    );

  const mainImage =
    Array.isArray(
      product.images
    ) &&
      product.images.length > 0
      ? product.images[0]
      : FALLBACK_IMAGE;

  const productId =
    String(product.id);

  const isWishlist =
    productIds.includes(
      productId
    );

  const isTogglingWishlist =
    String(
      togglingProductId
    ) === productId;

  const stock =
    Number(
      product.stock ?? 0
    );

  const isOutOfStock =
    stock <= 0;

  const isAddingToCart =
    cartMutationLoading &&
    activeCartAction ===
    'cart';

  const isBuyingNow =
    cartMutationLoading &&
    activeCartAction ===
    'buy';

  const redirectToLogin =
    () => {
      navigate('/login', {
        state: {
          from:
            location.pathname,
        },
      });
    };

  /*
   * Consultamos la alerta solamente
   * cuando:
   *
   * - el producto está agotado
   * - el usuario está autenticado
   *
   * Así evitamos peticiones innecesarias
   * para productos disponibles.
   */
  useEffect(() => {
    let cancelled = false;

    const loadRestockAlert =
      async () => {
        if (
          !isOutOfStock ||
          !isAuthenticated
        ) {
          setRestockSubscribed(
            false
          );

          setRestockInitialized(
            true
          );

          return;
        }

        setRestockInitialized(
          false
        );

        setRestockError('');

        try {
          const response =
            await getRestockAlertApi(
              product.id
            );

          if (cancelled) {
            return;
          }

          setRestockSubscribed(
            Boolean(
              response?.data
                ?.subscribed
            )
          );
        } catch {
          if (cancelled) {
            return;
          }

          /*
           * No bloqueamos la card si
           * falla esta consulta.
           */
          setRestockSubscribed(
            false
          );
        } finally {
          if (!cancelled) {
            setRestockInitialized(
              true
            );
          }
        }
      };

    loadRestockAlert();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    isOutOfStock,
    product.id,
  ]);

  const handleWishlistToggle =
    async (event) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }

      if (
        isTogglingWishlist
      ) {
        return;
      }

      try {
        await dispatch(
          toggleWishlistProduct(
            product.id
          )
        ).unwrap();
      } catch {
        return;
      }
    };

  const handleRestockAlert =
    async () => {
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }

      if (restockLoading) {
        return;
      }

      setRestockLoading(true);
      setRestockError('');

      try {
        if (
          restockSubscribed
        ) {
          await cancelRestockAlertApi(
            product.id
          );

          setRestockSubscribed(
            false
          );
        } else {
          await subscribeRestockAlertApi(
            product.id
          );

          setRestockSubscribed(
            true
          );
        }
      } catch (error) {
        setRestockError(
          error?.message ||
          'No se ha podido actualizar el aviso.'
        );
      } finally {
        setRestockLoading(
          false
        );
      }
    };

  const handleAddToCart =
    async () => {
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }

      if (
        cartMutationLoading ||
        isOutOfStock
      ) {
        return;
      }

      setActiveCartAction(
        'cart'
      );

      try {
        await dispatch(
          addCartItem({
            productId:
              product.id,
            quantity: 1,
          })
        ).unwrap();
      } catch {
        return;
      } finally {
        setActiveCartAction(
          null
        );
      }
    };

  const handleBuyNow =
    async () => {
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }

      if (
        cartMutationLoading ||
        isOutOfStock
      ) {
        return;
      }

      setActiveCartAction(
        'buy'
      );

      try {
        /*
         * IMPORTANTE:
         *
         * Este flujo todavía usa el
         * carrito normal.
         *
         * Lo corregiremos para que
         * "Comprar ahora" no mezcle
         * productos del carrito.
         */
        await dispatch(
          addCartItem({
            productId:
              product.id,
            quantity: 1,
          })
        ).unwrap();

        navigate(
          '/checkout'
        );
      } catch {
        return;
      } finally {
        setActiveCartAction(
          null
        );
      }
    };

  return (
    <article
      className={
        styles.productCard
      }
    >
      <div
        className={
          styles.productImageContainer
        }
      >
        <Link
          to={`/products/${product.id}`}
          className={
            styles.imageLink
          }
          aria-label={`Ver ${product.name}`}
        >
          <img
            src={mainImage}
            alt={product.name}
            className={
              styles.productImage
            }
          />
        </Link>

        {product.category && (
          <span
            className={
              styles.productBadge
            }
          >
            {product.category}
          </span>
        )}

        {!isOutOfStock && (
          <button
            type="button"
            onClick={
              handleWishlistToggle
            }
            disabled={
              isTogglingWishlist
            }
            className={`${styles.wishlistButton} ${isWishlist
                ? styles.wishlistButtonActive
                : ''
              }`}
            aria-label={
              isWishlist
                ? `Eliminar ${product.name} de la lista de deseos`
                : `Añadir ${product.name} a la lista de deseos`
            }
            aria-pressed={
              isWishlist
            }
          >
            <Heart
              size={19}
              fill={
                isWishlist
                  ? 'currentColor'
                  : 'none'
              }
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <div
        className={
          styles.productContent
        }
      >
        <h3
          className={
            styles.productTitle
          }
        >
          <Link
            to={`/products/${product.id}`}
            className={
              styles.productTitleLink
            }
          >
            {product.name}
          </Link>
        </h3>

        {isOutOfStock ? (
          <>
            <div
              className={
                styles.purchaseRow
              }
            >
              <span
                className={
                  styles.productPrice
                }
              >
                {Number(
                  product.price
                ).toFixed(2)}{' '}
                €
              </span>

              <span
                className={
                  styles.outOfStockStatus
                }
              >
                <PackageX
                  size={17}
                  aria-hidden="true"
                />

                Agotado
              </span>
            </div>

            <button
              type="button"
              onClick={
                handleRestockAlert
              }
              disabled={
                restockLoading ||
                (
                  isAuthenticated &&
                  !restockInitialized
                )
              }
              className={`${styles.restockButton} ${restockSubscribed
                  ? styles.restockButtonActive
                  : ''
                }`}
              aria-pressed={
                restockSubscribed
              }
            >
              {restockSubscribed ? (
                <BellRing
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <Bell
                  size={18}
                  aria-hidden="true"
                />
              )}

              {restockLoading
                ? 'Actualizando...'
                : isAuthenticated &&
                  !restockInitialized
                  ? 'Comprobando...'
                  : restockSubscribed
                    ? 'Aviso activado'
                    : 'Avísame cuando esté disponible'}
            </button>

            {restockSubscribed && (
              <p
                className={
                  styles.restockHelp
                }
                role="status"
              >
                Te enviaremos un correo cuando vuelva a estar disponible.
              </p>
            )}

            {restockError && (
              <p
                className={
                  styles.restockError
                }
                role="alert"
              >
                {restockError}
              </p>
            )}
          </>
        ) : (
          <>
            <div
              className={
                styles.purchaseRow
              }
            >
              <span
                className={
                  styles.productPrice
                }
              >
                {Number(
                  product.price
                ).toFixed(2)}{' '}
                €
              </span>

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  cartMutationLoading
                }
                className={
                  styles.cartButton
                }
                aria-label={`Añadir ${product.name} al carrito`}
              >
                <ShoppingCart
                  size={20}
                  aria-hidden="true"
                />

                <span
                  className={
                    styles.cartButtonText
                  }
                >
                  {isAddingToCart
                    ? 'Añadiendo...'
                    : 'Añadir'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={
                handleBuyNow
              }
              disabled={
                cartMutationLoading
              }
              className={
                styles.buyNowButton
              }
            >
              {isBuyingNow
                ? 'Preparando compra...'
                : 'Comprar ahora'}
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
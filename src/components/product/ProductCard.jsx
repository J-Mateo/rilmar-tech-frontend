import {
  useEffect,
  useState,
} from 'react';

import {
  Bell,
  BellRing,
  Heart,
  PackageX,
  ShoppingCart,
} from 'lucide-react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  cancelRestockAlertApi,
  getRestockAlertApi,
  subscribeRestockAlertApi,
} from '../../api/products.api';

import {
  addCartItem,
  prepareBuyNow,
  selectCartMutationLoading,
} from '../../store/slices/cartSlice';

import {
  toggleWishlistProduct,
} from '../../store/slices/wishlistSlice';

import formatCurrency from '../../utils/formatCurrency';

import styles from './ProductCard.module.css';

const ProductCard = ({
  product,
}) => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const isAuthenticated =
    useSelector(
      (state) =>
        state.auth.isAuthenticated
    );

  const cartMutationLoading =
    useSelector(
      selectCartMutationLoading
    );

  const isWishlist =
    useSelector(
      (state) =>
        state.wishlist.productIds.includes(
          String(product.id)
        )
    );

  const isTogglingWishlist =
    useSelector(
      (state) =>
        state.wishlist.togglingProductId ===
        String(product.id)
    );

  const [
    activeCartAction,
    setActiveCartAction,
  ] = useState(null);

  const [
    restockSubscribed,
    setRestockSubscribed,
  ] = useState(false);

  const [
    restockInitialized,
    setRestockInitialized,
  ] = useState(false);

  const [
    restockLoading,
    setRestockLoading,
  ] = useState(false);

  const [
    restockError,
    setRestockError,
  ] = useState('');

  const productImages =
    Array.isArray(
      product.images
    )
      ? product.images.filter(
          Boolean
        )
      : [];

  const mainImage =
    productImages[0] ||
    product.image ||
    '/placeholder-product.png';

  const isOutOfStock =
    Number(product.stock) <= 0;

  const isAddingToCart =
    activeCartAction ===
    'cart';

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isOutOfStock
    ) {
      return;
    }

    const controller =
      new AbortController();

    const loadRestockAlert =
      async () => {
        try {
          const response =
            await getRestockAlertApi(
              product.id,
              {
                signal:
                  controller.signal,
              }
            );

          if (
            controller.signal.aborted
          ) {
            return;
          }

          setRestockSubscribed(
            Boolean(
              response?.data
                ?.subscribed
            )
          );
        } catch {
          if (
            controller.signal.aborted
          ) {
            return;
          }

          setRestockSubscribed(
            false
          );
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setRestockInitialized(
              true
            );
          }
        }
      };

    loadRestockAlert();

    return () => {
      controller.abort();
    };
  }, [
    isAuthenticated,
    isOutOfStock,
    product.id,
  ]);

  const redirectToLogin =
    () => {
      navigate('/login', {
        state: {
          from:
            `${location.pathname}${location.search}`,
        },
      });
    };

  const handleWishlistToggle =
    async () => {
      if (
        !isAuthenticated
      ) {
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
      if (
        !isAuthenticated
      ) {
        redirectToLogin();
        return;
      }

      if (
        restockLoading
      ) {
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
      if (
        !isAuthenticated
      ) {
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
    () => {
      if (
        !isAuthenticated
      ) {
        redirectToLogin();
        return;
      }

      if (
        isOutOfStock
      ) {
        return;
      }

      dispatch(
        prepareBuyNow({
          product,
          quantity: 1,
        })
      );

      navigate('/checkout');
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
            src={
              mainImage
            }
            alt={
              product.name
            }
            className={
              styles.productImage
            }
            draggable="false"
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
            className={`${styles.wishlistButton} ${
              isWishlist
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
            {formatCurrency(
              product.price
            )}
          </span>

          {isOutOfStock ? (
            <span
              className={
                styles.outOfStockStatus
              }
            >
              <PackageX
                size={16}
                aria-hidden="true"
              />

              Agotado
            </span>
          ) : (
            <span
              className={
                styles.inStockStatus
              }
            >
              <span
                className={
                  styles.stockDot
                }
                aria-hidden="true"
              />

              En stock
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <>
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
              className={`${styles.restockButton} ${
                restockSubscribed
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
                    : 'Avísame cuando vuelva'}
            </button>

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
          <div
            className={
              styles.actions
            }
          >
            <button
              type="button"
              onClick={
                handleBuyNow
              }
              className={
                styles.buyNowButton
              }
            >
              Comprar ahora
            </button>

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
              aria-label={
                isAddingToCart
                  ? `Añadiendo ${product.name} al carrito`
                  : `Añadir ${product.name} al carrito`
              }
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
        )}
      </div>
    </article>
  );
};

export default ProductCard;
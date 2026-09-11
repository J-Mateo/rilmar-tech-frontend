import {
  Heart,
  ShoppingBag,
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
  addCartItem,
  selectCartMutationLoading,
} from '../../store/slices/cartSlice';

import {
  toggleWishlistProduct,
} from '../../store/slices/wishlistSlice';

import formatCurrency from '../../utils/formatCurrency';

import styles from './CatalogProductCard.module.css';

const getProductImage = (
  product
) =>
  product.images?.[0] ||
  product.image ||
  '/placeholder-product.png';

const CatalogProductCard = ({
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

  const isOutOfStock =
    Number(product.stock) <= 0;

  const redirectToLogin =
    () => {
      navigate('/login', {
        state: {
          from:
            `${location.pathname}${location.search}`,
        },
      });
    };

  const handleWishlist =
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

  const handleAddToCart =
    async () => {
      if (
        isOutOfStock ||
        cartMutationLoading
      ) {
        return;
      }

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
      }
    };

  return (
    <article
      className={
        styles.card
      }
    >
      <div
        className={
          styles.visual
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
              getProductImage(
                product
              )
            }
            alt={
              product.name
            }
            className={
              styles.image
            }
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={`${styles.wishlistButton} ${
            isWishlist
              ? styles.wishlistButtonActive
              : ''
          }`}
          onClick={
            handleWishlist
          }
          disabled={
            isTogglingWishlist
          }
          aria-label={
            isWishlist
              ? `Eliminar ${product.name} de favoritos`
              : `Añadir ${product.name} a favoritos`
          }
          aria-pressed={
            isWishlist
          }
        >
          <Heart
            size={18}
            fill={
              isWishlist
                ? 'currentColor'
                : 'none'
            }
            aria-hidden="true"
          />
        </button>

        {!isOutOfStock && (
          <div
            className={
              styles.quickCart
            }
          >
            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                cartMutationLoading
              }
              aria-label={`Añadir ${product.name} al carrito`}
            >
              <ShoppingBag
                size={18}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>

      <div
        className={
          styles.info
        }
      >
        {product.category && (
          <span
            className={
              styles.category
            }
          >
            {product.category}
          </span>
        )}

        <Link
          to={`/products/${product.id}`}
          className={
            styles.name
          }
        >
          {product.name}
        </Link>

        <div
          className={
            styles.bottomRow
          }
        >
          <strong
            className={
              styles.price
            }
          >
            {formatCurrency(
              product.price
            )}
          </strong>

          <span
            className={`${styles.stock} ${
              isOutOfStock
                ? styles.outOfStock
                : styles.inStock
            }`}
          >
            <span
              aria-hidden="true"
            />

            {isOutOfStock
              ? 'Agotado'
              : 'En stock'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CatalogProductCard;


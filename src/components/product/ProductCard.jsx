import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { toggleWishlistProduct } from '../../store/slices/wishlistSlice';
import styles from './ProductCard.module.css';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/400x300?text=Sin+imagen';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    productIds,
    loading: wishlistLoading,
  } = useSelector(
    (state) => state.wishlist
  );

  const mainImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : FALLBACK_IMAGE;

  const isWishlist = productIds.includes(
    String(product.id)
  );

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    try {
      await dispatch(
        toggleWishlistProduct(product.id)
      ).unwrap();
    } catch {
      return;
    }
  };

  return (
    <article className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <Link
          to={`/products/${product.id}`}
          className={styles.imageLink}
          aria-label={`Ver detalles de ${product.name}`}
        >
          <img
            src={mainImage}
            alt={product.name}
            className={styles.productImage}
          />
        </Link>

        {product.category && (
          <span className={styles.productBadge}>
            {product.category}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
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
          aria-pressed={isWishlist}
        >
          <Heart
            size={19}
            fill={isWishlist ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className={styles.productContent}>
        <h3 className={styles.productTitle}>
          <Link
            to={`/products/${product.id}`}
            className={styles.productTitleLink}
          >
            {product.name}
          </Link>
        </h3>

        <div className={styles.productFooter}>
          <span className={styles.productPrice}>
            {Number(product.price).toFixed(2)} €
          </span>

          <Link
            to={`/products/${product.id}`}
            className={styles.detailsButton}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
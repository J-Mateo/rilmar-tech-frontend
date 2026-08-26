import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';

import { useProduct } from '../hooks/useProduct';
import {
  addCartItem,
  selectCartMutationLoading,
} from '../store/slices/cartSlice';
import { toggleWishlistProduct } from '../store/slices/wishlistSlice';
import Button from '../components/common/Button/Button';
import styles from './ProductDetailPage.module.css';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/500x400?text=Sin+imagen';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState('');
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const { product, loading, error } = useProduct(id);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    productIds,
    togglingProductId,
  } = useSelector((state) => state.wishlist);

  const cartMutationLoading = useSelector(
    selectCartMutationLoading
  );

  if (loading) {
    return (
      <div className={styles.stateMessage}>
        Cargando detalle del producto...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.stateMessage}>
        Producto no encontrado.
      </div>
    );
  }

  const productId = String(product.id);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE];

  const currentImage =
    selectedImage && images.includes(selectedImage)
      ? selectedImage
      : images[0];

  const isWishlist = productIds.includes(productId);

  const isTogglingWishlist =
    String(togglingProductId) === productId;

  const isOutOfStock =
    product.stock !== null &&
    product.stock !== undefined &&
    Number(product.stock) <= 0;

  const handleMouseMove = (event) => {
    const {
      left,
      top,
      width,
      height,
    } = event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - left) / width) * 100;

    const y =
      ((event.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cartMutationLoading || isOutOfStock) {
      return;
    }

    try {
      await dispatch(
        addCartItem({
          productId: product.id,
          quantity: 1,
        })
      ).unwrap();
    } catch {
      return;
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated || isTogglingWishlist) {
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
    <main className={styles.container}>
      <nav
        className={styles.breadcrumb}
        aria-label="Navegación del producto"
      >
        <Link
          to="/products"
          className={styles.breadcrumbLink}
        >
          Catálogo
        </Link>

        <span>/</span>

        <span>
          {product.category || 'Producto'}
        </span>
      </nav>

      <div className={styles.grid}>
        <section
          className={styles.galleryColumn}
          aria-label={`Imágenes de ${product.name}`}
        >
          <div
            className={`${styles.mainImageWrapper} ${isHovered ? styles.mainImageWrapperZoomed : ''
              }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={currentImage}
              alt={product.name}
              className={`${styles.mainImage} ${isHovered ? styles.mainImageZoomed : ''
                }`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>

          {images.length > 1 && (
            <div
              className={styles.thumbnailList}
              aria-label="Galería de imágenes"
            >
              {images.map((imageUrl, index) => {
                const isActive =
                  currentImage === imageUrl;

                return (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onMouseEnter={() =>
                      setSelectedImage(imageUrl)
                    }
                    onClick={() =>
                      setSelectedImage(imageUrl)
                    }
                    className={`${styles.thumbnailBtn} ${isActive
                        ? styles.thumbnailBtnActive
                        : ''
                      }`}
                    aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                    aria-pressed={isActive}
                  >
                    <img
                      src={imageUrl}
                      alt=""
                      className={styles.thumbnailImg}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.infoColumn}>
          <h1 className={styles.productTitle}>
            {product.name}
          </h1>

          <div className={styles.ratingWrapper}>
            <span className={styles.ratingValue}>
              4.5
            </span>

            <div
              className={styles.stars}
              aria-label="Valoración de 4.5 sobre 5"
            >
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star
                size={16}
                className={styles.inactiveStar}
              />
            </div>

            <span className={styles.reviewCount}>
              <MessageSquare size={14} />
              10 opiniones
            </span>
          </div>

          {product.category && (
            <p className={styles.categoryTag}>
              {product.category}
            </p>
          )}

          <div className={styles.price}>
            {Number(product.price).toFixed(2)} €
          </div>

          <div className={styles.stockStatus}>
            {isOutOfStock ? (
              <span className={styles.outOfStock}>
                Sin stock
              </span>
            ) : (
              <span className={styles.inStock}>
                Disponible
              </span>
            )}
          </div>

          <div className={styles.actionButtons}>
            <Button
              type="button"
              variant="primary"
              className={styles.primaryAction}
              onClick={handleAddToCart}
              disabled={
                cartMutationLoading || isOutOfStock
              }
              isLoading={cartMutationLoading}
            >
              <ShoppingCart size={18} />
              AÑADIR AL CARRITO
            </Button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleWishlist}
                disabled={isTogglingWishlist}
                className={`${styles.wishlistBtn} ${isWishlist
                    ? styles.wishlistBtnActive
                    : ''
                  }`}
                aria-pressed={isWishlist}
              >
                <Heart
                  size={16}
                  fill={
                    isWishlist
                      ? 'currentColor'
                      : 'none'
                  }
                />

                {isWishlist
                  ? 'EN TU LISTA DE DESEOS'
                  : 'AÑADIR A LA LISTA DE DESEOS'}
              </button>
            ) : (
              <Link
                to="/login"
                className={styles.wishlistBtn}
              >
                <Heart size={16} />
                INICIA SESIÓN PARA GUARDARLO
              </Link>
            )}
          </div>

          <div className={styles.guaranteesBox}>
            <div className={styles.guaranteeItem}>
              <Truck size={18} />
              ENVÍO GRATUITO (DE 24 A 48 HORAS)
            </div>

            <div className={styles.guaranteeItem}>
              <RefreshCw size={18} />
              30 DÍAS DE PRUEBA SIN COMPROMISO
            </div>

            <div className={styles.guaranteeItem}>
              <ShieldCheck size={18} />
              3 AÑOS DE GARANTÍA OFICIAL
            </div>
          </div>

          {product.description && (
            <p className={styles.description}>
              {product.description}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductDetailPage;
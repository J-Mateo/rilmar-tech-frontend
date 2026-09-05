import {
  useMemo,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Heart,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { useProduct } from '../hooks/useProduct';
import { useReviews } from '../hooks/useReviews';

import {
  addCartItem,
  selectCartMutationLoading,
} from '../store/slices/cartSlice';

import {
  toggleWishlistProduct,
} from '../store/slices/wishlistSlice';

import Button from '../components/common/Button/Button';
import ReviewForm from '../components/reviews/ReviewForm/ReviewForm';

import styles from './ProductDetailPage.module.css';

const FALLBACK_IMAGE =
  'https://via.placeholder.com/500x400?text=Sin+imagen';

const dateFormatter =
  new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  });

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] =
    useState('');

  const [isZoomed, setIsZoomed] =
    useState(false);

  const [zoomPosition, setZoomPosition] =
    useState({
      x: 50,
      y: 50,
    });

  const {
    product,
    loading,
    error,
  } = useProduct(id);

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviews(id);

  const {
    isAuthenticated,
  } = useSelector(
    (state) => state.auth
  );

  const {
    productIds,
    togglingProductId,
  } = useSelector(
    (state) => state.wishlist
  );

  const cartMutationLoading = useSelector(
    selectCartMutationLoading
  );

  const ratingSummary = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        count: 0,
      };
    }

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    return {
      average:
        total / reviews.length,
      count: reviews.length,
    };
  }, [reviews]);

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

  const productId =
    String(product.id);

  const images =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : [FALLBACK_IMAGE];

  const currentImage =
    selectedImage &&
    images.includes(selectedImage)
      ? selectedImage
      : images[0];

  const isWishlist =
    productIds.includes(productId);

  const isTogglingWishlist =
    String(togglingProductId) ===
    productId;

  const isOutOfStock =
    product.stock !== null &&
    product.stock !== undefined &&
    Number(product.stock) <= 0;

  const handleZoomMove = (
    event
  ) => {
    if (!isZoomed) {
      return;
    }

    const {
      left,
      top,
      width,
      height,
    } =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - left) /
        width) *
      100;

    const y =
      ((event.clientY - top) /
        height) *
      100;

    setZoomPosition({
      x: Math.min(
        100,
        Math.max(0, x)
      ),
      y: Math.min(
        100,
        Math.max(0, y)
      ),
    });
  };

  const handleZoomToggle = () => {
    setIsZoomed(
      (currentValue) =>
        !currentValue
    );

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const handleImageSelect = (
    imageUrl
  ) => {
    setSelectedImage(
      imageUrl
    );

    setIsZoomed(false);

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const handleAddToCart =
    async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (
        cartMutationLoading ||
        isOutOfStock
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

  const handleWishlist =
    async () => {
      if (
        !isAuthenticated ||
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

  return (
    <main className={styles.container}>
      <nav
        className={styles.breadcrumb}
        aria-label="Navegación del producto"
      >
        <Link
          to="/products"
          className={
            styles.breadcrumbLink
          }
        >
          Catálogo
        </Link>

        <span
          className={
            styles.breadcrumbSeparator
          }
          aria-hidden="true"
        >
          /
        </span>

        <span
          className={
            styles.breadcrumbCurrent
          }
        >
          {product.category ||
            'Producto'}
        </span>
      </nav>

      <div className={styles.grid}>
        <section
          className={
            styles.galleryColumn
          }
          aria-label={`Imágenes de ${product.name}`}
        >
          <div
            className={`${styles.mainImageWrapper} ${
              isZoomed
                ? styles.mainImageWrapperZoomed
                : ''
            }`}
            onMouseMove={
              handleZoomMove
            }
          >
            <img
              src={currentImage}
              alt={product.name}
              className={`${styles.mainImage} ${
                isZoomed
                  ? styles.mainImageZoomed
                  : ''
              }`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />

            <button
              type="button"
              onClick={
                handleZoomToggle
              }
              className={
                styles.zoomButton
              }
              aria-label={
                isZoomed
                  ? `Desactivar zoom de ${product.name}`
                  : `Ampliar imagen de ${product.name}`
              }
              aria-pressed={
                isZoomed
              }
            >
              {isZoomed ? (
                <ZoomOut
                  size={20}
                  aria-hidden="true"
                />
              ) : (
                <ZoomIn
                  size={20}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          {images.length > 1 && (
            <div
              className={
                styles.thumbnailList
              }
              aria-label="Galería de imágenes"
            >
              {images.map(
                (
                  imageUrl,
                  index
                ) => {
                  const isActive =
                    currentImage ===
                    imageUrl;

                  return (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onMouseEnter={() =>
                        handleImageSelect(
                          imageUrl
                        )
                      }
                      onClick={() =>
                        handleImageSelect(
                          imageUrl
                        )
                      }
                      className={`${styles.thumbnailBtn} ${
                        isActive
                          ? styles.thumbnailBtnActive
                          : ''
                      }`}
                      aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                      aria-pressed={
                        isActive
                      }
                    >
                      <img
                        src={
                          imageUrl
                        }
                        alt=""
                        className={
                          styles.thumbnailImg
                        }
                      />
                    </button>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section
          className={
            styles.infoColumn
          }
        >
          <h1
            className={
              styles.productTitle
            }
          >
            {product.name}
          </h1>

          <div
            className={
              styles.ratingWrapper
            }
          >
            <span
              className={
                styles.ratingValue
              }
            >
              {ratingSummary.count >
              0
                ? ratingSummary.average.toFixed(
                    1
                  )
                : '—'}
            </span>

            <div
              className={
                styles.stars
              }
              aria-label={
                ratingSummary.count >
                0
                  ? `Valoración de ${ratingSummary.average.toFixed(1)} sobre 5`
                  : 'Producto sin valoraciones'
              }
            >
              {[
                1,
                2,
                3,
                4,
                5,
              ].map((star) => {
                const active =
                  star <=
                  Math.round(
                    ratingSummary.average
                  );

                return (
                  <Star
                    key={star}
                    size={16}
                    fill={
                      active
                        ? 'currentColor'
                        : 'none'
                    }
                    className={
                      active
                        ? ''
                        : styles.inactiveStar
                    }
                    aria-hidden="true"
                  />
                );
              })}
            </div>

            <span
              className={
                styles.reviewCount
              }
            >
              <MessageSquare
                size={14}
                aria-hidden="true"
              />

              {
                ratingSummary.count
              }{' '}
              {ratingSummary.count ===
              1
                ? 'opinión'
                : 'opiniones'}
            </span>
          </div>

          {product.category && (
            <p
              className={
                styles.categoryTag
              }
            >
              {product.category}
            </p>
          )}

          <div
            className={
              styles.price
            }
          >
            {Number(
              product.price
            ).toFixed(2)}{' '}
            €
          </div>

          <div
            className={
              styles.stockStatus
            }
          >
            {isOutOfStock ? (
              <span
                className={
                  styles.outOfStock
                }
              >
                Sin stock
              </span>
            ) : (
              <span
                className={
                  styles.inStock
                }
              >
                Disponible
              </span>
            )}
          </div>

          <div
            className={
              styles.actionButtons
            }
          >
            <Button
              type="button"
              variant="primary"
              className={
                styles.primaryAction
              }
              onClick={
                handleAddToCart
              }
              disabled={
                cartMutationLoading ||
                isOutOfStock
              }
              isLoading={
                cartMutationLoading
              }
            >
              <ShoppingCart
                size={18}
                aria-hidden="true"
              />

              AÑADIR AL CARRITO
            </Button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={
                  handleWishlist
                }
                disabled={
                  isTogglingWishlist
                }
                className={`${styles.wishlistBtn} ${
                  isWishlist
                    ? styles.wishlistBtnActive
                    : ''
                }`}
                aria-pressed={
                  isWishlist
                }
              >
                <Heart
                  size={16}
                  fill={
                    isWishlist
                      ? 'currentColor'
                      : 'none'
                  }
                  aria-hidden="true"
                />

                {isWishlist
                  ? 'EN TU LISTA DE DESEOS'
                  : 'AÑADIR A LA LISTA DE DESEOS'}
              </button>
            ) : (
              <Link
                to="/login"
                className={
                  styles.wishlistBtn
                }
              >
                <Heart
                  size={16}
                  aria-hidden="true"
                />

                INICIA SESIÓN PARA
                GUARDARLO
              </Link>
            )}
          </div>

          <div
            className={
              styles.guaranteesBox
            }
          >
            <div
              className={
                styles.guaranteeItem
              }
            >
              <Truck
                size={18}
                aria-hidden="true"
              />

              ENVÍO GRATUITO (DE 24 A
              48 HORAS)
            </div>

            <div
              className={
                styles.guaranteeItem
              }
            >
              <RefreshCw
                size={18}
                aria-hidden="true"
              />

              30 DÍAS DE PRUEBA SIN
              COMPROMISO
            </div>

            <div
              className={
                styles.guaranteeItem
              }
            >
              <ShieldCheck
                size={18}
                aria-hidden="true"
              />

              3 AÑOS DE GARANTÍA
              OFICIAL
            </div>
          </div>

          {product.description && (
            <p
              className={
                styles.description
              }
            >
              {product.description}
            </p>
          )}
        </section>
      </div>

      <section
        className={
          styles.reviewsSection
        }
        aria-labelledby="reviews-title"
      >
        <div
          className={
            styles.reviewsHeader
          }
        >
          <div>
            <p
              className={
                styles.reviewsEyebrow
              }
            >
              Opiniones
            </p>

            <h2
              id="reviews-title"
              className={
                styles.reviewsTitle
              }
            >
              Reseñas de clientes
            </h2>
          </div>

          <span
            className={
              styles.reviewsCountBadge
            }
          >
            {ratingSummary.count}{' '}
            {ratingSummary.count ===
            1
              ? 'reseña'
              : 'reseñas'}
          </span>
        </div>

        {isAuthenticated ? (
          <ReviewForm
            productId={
              product.id
            }
            onReviewCreated={
              refetchReviews
            }
          />
        ) : (
          <div
            className={
              styles.reviewLogin
            }
          >
            <p>
              Inicia sesión para
              publicar una reseña.
            </p>

            <Link
              to="/login"
              className={
                styles.reviewLoginLink
              }
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {reviewsLoading && (
          <p
            className={
              styles.reviewsState
            }
          >
            Cargando reseñas...
          </p>
        )}

        {reviewsError && (
          <p
            className={
              styles.reviewsError
            }
            role="alert"
          >
            {reviewsError}
          </p>
        )}

        {!reviewsLoading &&
          !reviewsError &&
          reviews.length ===
            0 && (
            <p
              className={
                styles.reviewsState
              }
            >
              Este producto todavía
              no tiene reseñas.
            </p>
          )}

        {!reviewsLoading &&
          !reviewsError &&
          reviews.length >
            0 && (
            <div
              className={
                styles.reviewList
              }
            >
              {reviews.map(
                (review) => (
                  <article
                    key={
                      review._id
                    }
                    className={
                      styles.review
                    }
                  >
                    <div
                      className={
                        styles.reviewTop
                      }
                    >
                      <div
                        className={
                          styles.reviewStars
                        }
                        aria-label={`${review.rating} de 5 estrellas`}
                      >
                        {[
                          1,
                          2,
                          3,
                          4,
                          5,
                        ].map(
                          (
                            star
                          ) => {
                            const active =
                              star <=
                              Number(
                                review.rating
                              );

                            return (
                              <Star
                                key={
                                  star
                                }
                                size={
                                  16
                                }
                                fill={
                                  active
                                    ? 'currentColor'
                                    : 'none'
                                }
                                className={
                                  active
                                    ? ''
                                    : styles.inactiveStar
                                }
                                aria-hidden="true"
                              />
                            );
                          }
                        )}
                      </div>

                      <time
                        className={
                          styles.reviewDate
                        }
                        dateTime={
                          review.createdAt
                        }
                      >
                        {review.createdAt
                          ? dateFormatter.format(
                              new Date(
                                review.createdAt
                              )
                            )
                          : ''}
                      </time>
                    </div>

                    <p
                      className={
                        styles.reviewComment
                      }
                    >
                      {
                        review.comment
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          )}
      </section>
    </main>
  );
};

export default ProductDetailPage;
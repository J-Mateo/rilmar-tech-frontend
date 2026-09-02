import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';
import {
  fetchWishlist,
} from '../store/slices/wishlistSlice';

import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const dispatch = useDispatch();

  const productParams = useMemo(() => ({}), []);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts(productParams);

  const {
    productIds,
    loading: wishlistLoading,
    initialized,
    error: wishlistError,
  } = useSelector((state) => state.wishlist);

  const wishlistProducts = useMemo(() => {
    const wishlistIds = new Set(
      productIds.map(String)
    );

    return products.filter((product) =>
      wishlistIds.has(String(product.id))
    );
  }, [productIds, products]);

  const handleRetry = () => {
    dispatch(fetchWishlist());
    refetch();
  };

  const loading =
    !initialized ||
    productsLoading ||
    wishlistLoading;

  const error =
    wishlistError || productsError;

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.state}>
          <Heart
            size={34}
            aria-hidden="true"
          />

          <p>
            Cargando lista de deseos...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <Heart
            size={34}
            aria-hidden="true"
          />

          <h1 className={styles.stateTitle}>
            No se ha podido cargar tu lista de deseos
          </h1>

          <p className={styles.errorMessage}>
            {error}
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={handleRetry}
          >
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Tus favoritos
          </p>

          <h1 className={styles.title}>
            Lista de Deseos
          </h1>

          <p className={styles.subtitle}>
            Guarda tus productos favoritos para encontrarlos fácilmente más tarde.
          </p>
        </div>

        <div
          className={styles.headerIcon}
          aria-hidden="true"
        >
          <Heart size={28} />
        </div>
      </header>

      {wishlistProducts.length === 0 ? (
        <section className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Heart
              size={34}
              aria-hidden="true"
            />
          </div>

          <h2>
            Tu lista de deseos está vacía
          </h2>

          <p>
            Explora el catálogo y pulsa el corazón de los productos que quieras guardar.
          </p>

          <Link
            to="/products"
            className={styles.catalogLink}
          >
            Explorar catálogo
          </Link>
        </section>
      ) : (
        <section
          aria-labelledby="wishlist-products-title"
        >
          <div className={styles.sectionHeader}>
            <h2
              id="wishlist-products-title"
              className={styles.sectionTitle}
            >
              Productos guardados
            </h2>

            <span className={styles.count}>
              {wishlistProducts.length}{' '}
              {wishlistProducts.length === 1
                ? 'producto'
                : 'productos'}
            </span>
          </div>

          <ProductGrid
            products={wishlistProducts}
          />
        </section>
      )}
    </main>
  );
};

export default WishlistPage;
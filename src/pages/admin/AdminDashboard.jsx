import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  AlertTriangle,
  ArrowRight,
  CircleCheck,
  Package,
  PackageX,
  Plus,
} from 'lucide-react';

import {
  getAdminProducts,
} from '../../api/products.api';

import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [
    recentProducts,
    setRecentProducts,
  ] = useState([]);

  const [
    stats,
    setStats,
  ] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    const controller =
      new AbortController();

    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError('');

          const options = {
            signal:
              controller.signal,
          };

          const [
            recentResponse,
            totalResponse,
            activeResponse,
            outOfStockResponse,
            lowStockResponse,
          ] =
            await Promise.all([
              getAdminProducts(
                {
                  page: 1,
                  limit: 5,
                },
                options
              ),

              getAdminProducts(
                {
                  page: 1,
                  limit: 1,
                },
                options
              ),

              getAdminProducts(
                {
                  page: 1,
                  limit: 1,
                  status:
                    'active',
                },
                options
              ),

              getAdminProducts(
                {
                  page: 1,
                  limit: 1,
                  status:
                    'active',
                  stock:
                    'outOfStock',
                },
                options
              ),

              getAdminProducts(
                {
                  page: 1,
                  limit: 1,
                  status:
                    'active',
                  stock:
                    'lowStock',
                },
                options
              ),
            ]);

          setRecentProducts(
            recentResponse.data ??
              []
          );

          setStats({
            total:
              totalResponse.meta
                ?.total ??
              0,

            active:
              activeResponse.meta
                ?.total ??
              0,

            outOfStock:
              outOfStockResponse
                .meta?.total ??
              0,

            lowStock:
              lowStockResponse.meta
                ?.total ??
              0,
          });
        } catch (
          requestError
        ) {
          if (
            requestError?.code ===
            'REQUEST_CANCELED'
          ) {
            return;
          }

          setError(
            requestError?.message ||
              'No se ha podido cargar el resumen'
          );
        } finally {
          if (
            !controller
              .signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section
      className={
        styles.dashboard
      }
    >
      <div
        className={
          styles.hero
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Panel administrativo
          </p>

          <h1
            className={
              styles.title
            }
          >
            Resumen
          </h1>

          <p
            className={
              styles.description
            }
          >
            Controla el catálogo,
            el stock y el estado
            de los productos de
            Rilmar Tech.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className={
            styles.primaryAction
          }
        >
          <Plus
            size={18}
            aria-hidden="true"
          />

          Nuevo producto
        </Link>
      </div>

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
          styles.statsGrid
        }
      >
        <article
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.iconBox
            }
          >
            <Package
              size={22}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className={
                styles.statLabel
              }
            >
              Total productos
            </p>

            <strong
              className={
                styles.statValue
              }
            >
              {loading
                ? '—'
                : stats.total}
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.iconBox
            }
          >
            <CircleCheck
              size={22}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className={
                styles.statLabel
              }
            >
              Activos
            </p>

            <strong
              className={
                styles.statValue
              }
            >
              {loading
                ? '—'
                : stats.active}
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.iconBox
            }
          >
            <PackageX
              size={22}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className={
                styles.statLabel
              }
            >
              Agotados
            </p>

            <strong
              className={
                styles.statValue
              }
            >
              {loading
                ? '—'
                : stats.outOfStock}
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.iconBox
            }
          >
            <AlertTriangle
              size={22}
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className={
                styles.statLabel
              }
            >
              Stock bajo
            </p>

            <strong
              className={
                styles.statValue
              }
            >
              {loading
                ? '—'
                : stats.lowStock}
            </strong>
          </div>
        </article>
      </div>

      <section
        className={
          styles.panel
        }
      >
        <div
          className={
            styles.panelHeader
          }
        >
          <div>
            <p
              className={
                styles.panelEyebrow
              }
            >
              Catálogo
            </p>

            <h2>
              Productos recientes
            </h2>
          </div>

          <Link
            to="/admin/products"
            className={
              styles.textLink
            }
          >
            Ver todos

            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>
        </div>

        {loading ? (
          <p
            className={
              styles.emptyState
            }
          >
            Cargando productos...
          </p>
        ) : recentProducts.length ===
          0 ? (
          <p
            className={
              styles.emptyState
            }
          >
            No hay productos.
          </p>
        ) : (
          <div
            className={
              styles.productList
            }
          >
            {recentProducts.map(
              (product) => (
                <div
                  key={
                    product.id
                  }
                  className={
                    styles.productRow
                  }
                >
                  <div
                    className={
                      styles.productInfo
                    }
                  >
                    {product
                      .images?.[0] ? (
                      <img
                        src={
                          product
                            .images[0]
                        }
                        alt=""
                        className={
                          styles.thumbnail
                        }
                      />
                    ) : (
                      <div
                        className={
                          styles.thumbnailPlaceholder
                        }
                      >
                        <Package
                          size={20}
                          aria-hidden="true"
                        />
                      </div>
                    )}

                    <div>
                      <strong>
                        {
                          product.name
                        }
                      </strong>

                      <span>
                        {product.category ||
                          'Sin categoría'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.productMeta
                    }
                  >
                    <span>
                      {
                        product.stock
                      }{' '}
                      uds.
                    </span>

                    <span
                      className={
                        product.isActive
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {product.isActive
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </section>
  );
};

export default AdminDashboard;
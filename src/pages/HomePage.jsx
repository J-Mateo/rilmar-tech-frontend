import {
  useMemo,
  useState,
} from 'react';

import {
  ArrowRight,
  Headphones,
  Home,
  Laptop,
  Lightbulb,
  LockKeyhole,
  Palette,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import HomeProductCard from '../components/home/HomeProductCard';
import { useProducts } from '../hooks/useProducts';
import formatCurrency from '../utils/formatCurrency';

import homeHeroImage from '../assets/home-hero.jpg';
import homeLifestyleImage from '../assets/home-lifestyle.jpg';

import styles from './HomePage.module.css';

const HERO_PRODUCTS = [
  {
    name: 'Lámpara Inteligente',
    positionClass:
      'hotspotLamp',
  },
  {
    name: 'Ordenador Portátil',
    positionClass:
      'hotspotLaptop',
  },
  {
    name: 'Altavoz Inalámbrico',
    positionClass:
      'hotspotSpeaker',
  },
  {
    name: 'Robot Aspirador',
    positionClass:
      'hotspotRobot',
  },
];

const DISCOVERY_PRODUCT_NAMES = [
  'Robot de Asistencia',
  'Dron Compacto',
  'Grabadora con IA',
];

const CATEGORY_OPTIONS = [
  {
    name: 'Audio',
    icon: Headphones,
  },
  {
    name: 'Smart Home',
    icon: Home,
  },
  {
    name: 'Workspace',
    icon: Laptop,
  },
  {
    name: 'Productividad',
    icon: Lightbulb,
  },
  {
    name: 'Creatividad',
    icon: Palette,
  },
];

const TRUST_ITEMS = [
  {
    title: 'Envío rápido',
    description:
      'Recibe tus productos de forma cómoda y segura.',
    icon: Truck,
  },
  {
    title: 'Compra segura',
    description:
      'Pagos protegidos durante todo el proceso.',
    icon: ShieldCheck,
  },
  {
    title: 'Devoluciones',
    description:
      'Una experiencia de compra clara también después del pedido.',
    icon: RotateCcw,
  },
  {
    title: 'Tecnología seleccionada',
    description:
      'Productos pensados para aportar utilidad real.',
    icon: LockKeyhole,
  },
];

const getProductImage = (
  product
) =>
  product.images?.[0] ||
  product.image ||
  '/placeholder-product.png';

const HomePage = () => {
  const [
    activeHotspot,
    setActiveHotspot,
  ] = useState(null);

  const homeParams =
    useMemo(
      () => ({
        limit: 50,
      }),
      []
    );

  const {
    products = [],
    loading,
    error,
    refetch,
  } =
    useProducts(
      homeParams
    );

  const productsByName =
    useMemo(
      () =>
        new Map(
          products.map(
            (product) => [
              product.name,
              product,
            ]
          )
        ),
      [products]
    );

  const heroProducts =
    useMemo(
      () =>
        HERO_PRODUCTS.map(
          (item) => ({
            ...item,
            product:
              productsByName.get(
                item.name
              ) ?? null,
          })
        ),
      [productsByName]
    );

  const availableHeroProducts =
    useMemo(
      () =>
        heroProducts.filter(
          (item) =>
            Boolean(
              item.product
            )
        ),
      [heroProducts]
    );

  const discoveryProducts =
    useMemo(
      () =>
        DISCOVERY_PRODUCT_NAMES.map(
          (name) =>
            productsByName.get(
              name
            )
        ).filter(Boolean),
      [productsByName]
    );

  const handleHotspotToggle =
    (productId) => {
      setActiveHotspot(
        (current) =>
          current === productId
            ? null
            : productId
      );
    };

  const handleHotspotEnter =
    (productId) => {
      setActiveHotspot(
        productId
      );
    };

  const handleHotspotLeave =
    (event) => {
      if (
        event.currentTarget.contains(
          document.activeElement
        )
      ) {
        return;
      }

      setActiveHotspot(
        null
      );
    };

  const handleHotspotBlur =
    (event) => {
      if (
        event.currentTarget.contains(
          event.relatedTarget
        )
      ) {
        return;
      }

      setActiveHotspot(
        null
      );
    };

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.hero
        }
        aria-labelledby="home-hero-title"
      >
        <img
          src={
            homeHeroImage
          }
          alt=""
          className={
            styles.heroImage
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroShade
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroCopy
          }
        >
          <h1
            id="home-hero-title"
            className={
              styles.heroTitle
            }
          >
            Tecnología que hace
            mejor tu día a día.
          </h1>

          <div
            className={
              styles.heroSecondaryCopy
            }
          >
            <p
              className={
                styles.heroDescription
              }
            >
              Descubre una
              selección de
              productos
              tecnológicos
              pensados para
              vivir, trabajar y
              disfrutar mejor.
            </p>

            <Link
              to="/products"
              className={
                styles.primaryCta
              }
            >
              Explorar productos

              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {!loading &&
          availableHeroProducts.map(
            ({
              product,
              positionClass,
            }) => {
              const isOpen =
                activeHotspot ===
                product.id;

              const popoverId =
                `hero-product-${product.id}`;

              return (
                <div
                  key={
                    product.id
                  }
                  className={`${styles.hotspotGroup} ${styles[positionClass]}`}
                  onMouseEnter={() =>
                    handleHotspotEnter(
                      product.id
                    )
                  }
                  onMouseLeave={
                    handleHotspotLeave
                  }
                  onFocus={() =>
                    handleHotspotEnter(
                      product.id
                    )
                  }
                  onBlur={
                    handleHotspotBlur
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.hotspotButton
                    }
                    onClick={() =>
                      handleHotspotToggle(
                        product.id
                      )
                    }
                    aria-label={`Descubrir ${product.name}`}
                    aria-expanded={
                      isOpen
                    }
                    aria-controls={
                      popoverId
                    }
                  >
                    <span
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={
                        popoverId
                      }
                      className={
                        styles.hotspotPopover
                      }
                    >
                      <button
                        type="button"
                        className={
                          styles.popoverClose
                        }
                        onClick={() =>
                          setActiveHotspot(
                            null
                          )
                        }
                        aria-label="Cerrar información del producto"
                      >
                        <X
                          size={
                            15
                          }
                          aria-hidden="true"
                        />
                      </button>

                      <p
                        className={
                          styles.popoverCategory
                        }
                      >
                        {
                          product.category
                        }
                      </p>

                      <strong
                        className={
                          styles.popoverName
                        }
                      >
                        {
                          product.name
                        }
                      </strong>

                      <span
                        className={
                          styles.popoverPrice
                        }
                      >
                        {formatCurrency(
                          product.price
                        )}
                      </span>

                      <Link
                        to={`/products/${product.id}`}
                        className={
                          styles.popoverLink
                        }
                      >
                        Ver producto

                        <ArrowRight
                          size={
                            15
                          }
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              );
            }
          )}
      </section>

      {!loading &&
        availableHeroProducts.length >
          0 && (
          <section
            className={
              styles.mobileHeroProducts
            }
            aria-label="Productos de la imagen principal"
          >
            <div
              className={
                styles.mobileHeroProductTrack
              }
            >
              {availableHeroProducts.map(
                ({
                  product,
                }) => (
                  <Link
                    key={
                      product.id
                    }
                    to={`/products/${product.id}`}
                    className={
                      styles.mobileHeroProduct
                    }
                  >
                    <img
                      src={getProductImage(
                        product
                      )}
                      alt=""
                      className={
                        styles.mobileHeroProductImage
                      }
                    />

                    <span
                      className={
                        styles.mobileHeroProductInfo
                      }
                    >
                      <strong>
                        {
                          product.name
                        }
                      </strong>

                      <small>
                        {formatCurrency(
                          product.price
                        )}
                      </small>
                    </span>

                    <ArrowRight
                      size={17}
                      aria-hidden="true"
                    />
                  </Link>
                )
              )}
            </div>
          </section>
        )}

      <section
        className={
          styles.discoverySection
        }
        aria-labelledby="discovery-title"
      >
        <div
          className={
            styles.sectionHeading
          }
        >
          <div>
            <p
              className={
                styles.sectionEyebrow
              }
            >
              Nuestra selección
            </p>

            <h2
              id="discovery-title"
              className={
                styles.sectionTitle
              }
            >
              Descubre algo nuevo
            </h2>

            <p
              className={
                styles.sectionDescription
              }
            >
              Tecnología diferente
              para trabajar, crear
              y disfrutar.
            </p>
          </div>

          <Link
            to="/products"
            className={
              styles.textLink
            }
          >
            Ver todo

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </div>

        {loading && (
          <div
            className={
              styles.productsState
            }
            role="status"
            aria-live="polite"
          >
            Cargando nuestra
            selección...
          </div>
        )}

        {!loading &&
          error && (
            <div
              className={
                styles.productsError
              }
              role="alert"
            >
              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  refetch
                }
                className={
                  styles.retryButton
                }
              >
                Reintentar
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          discoveryProducts.length >
            0 && (
            <div
              className={
                styles.homeProductGrid
              }
            >
              {discoveryProducts.map(
                (
                  product
                ) => (
                  <HomeProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
            </div>
          )}

        {!loading &&
          !error &&
          discoveryProducts.length ===
            0 && (
            <div
              className={
                styles.productsState
              }
            >
              Nuestra selección
              estará disponible
              próximamente.
            </div>
          )}
      </section>

      <section
        className={
          styles.categoriesSection
        }
        aria-labelledby="categories-title"
      >
        <div
          className={
            styles.categoriesHeader
          }
        >
          <h2
            id="categories-title"
            className={
              styles.categoriesTitle
            }
          >
            Explora por categoría
          </h2>

          <Link
            to="/products"
            className={
              styles.textLink
            }
          >
            Ver todas

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </div>

        <nav
          className={
            styles.categoryList
          }
          aria-label="Categorías de productos"
        >
          {CATEGORY_OPTIONS.map(
            ({
              name,
              icon: Icon,
            }) => (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(
                  name
                )}`}
                className={
                  styles.categoryLink
                }
              >
                <span
                  className={
                    styles.categoryIcon
                  }
                >
                  <Icon
                    size={27}
                    strokeWidth={
                      1.7
                    }
                    aria-hidden="true"
                  />
                </span>

                <span>
                  {name}
                </span>
              </Link>
            )
          )}
        </nav>
      </section>

      <section
        className={
          styles.lifestyleSection
        }
        aria-labelledby="lifestyle-title"
      >
        <img
          src={
            homeLifestyleImage
          }
          alt=""
          className={
            styles.lifestyleImage
          }
          loading="lazy"
          aria-hidden="true"
        />

        <div
          className={
            styles.lifestyleShade
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.lifestyleContent
          }
        >
          <h2
            id="lifestyle-title"
            className={
              styles.lifestyleTitle
            }
          >
            Tecnología para un
            estilo de vida real
          </h2>

          <p
            className={
              styles.lifestyleDescription
            }
          >
            En RILMARTECH creemos
            en una tecnología útil,
            accesible y de calidad,
            que se integra en tu día
            a día para que puedas
            centrarte en lo
            importante.
          </p>

          <Link
            to="/about"
            className={
              styles.lifestyleLink
            }
          >
            Conoce Rilmar Tech

            <ArrowRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section
        className={
          styles.trustSection
        }
        aria-label="Ventajas de comprar en Rilmar Tech"
      >
        {TRUST_ITEMS.map(
          ({
            title,
            description,
            icon: Icon,
          }) => (
            <article
              key={title}
              className={
                styles.trustItem
              }
            >
              <span
                className={
                  styles.trustIcon
                }
              >
                <Icon
                  size={21}
                  strokeWidth={
                    1.8
                  }
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2>
                  {title}
                </h2>

                <p>
                  {description}
                </p>
              </div>
            </article>
          )
        )}
      </section>
    </main>
  );
};

export default HomePage;
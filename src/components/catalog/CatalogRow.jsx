import {
  useRef,
} from 'react';

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import CatalogProductCard from './CatalogProductCard';

import styles from './CatalogRow.module.css';

const CatalogRow = ({
  title,
  description,
  products = [],
  onViewAll,
}) => {
  const trackRef =
    useRef(null);

  const scroll =
    (direction) => {
      const track =
        trackRef.current;

      if (!track) {
        return;
      }

      const amount =
        track.clientWidth *
        0.78;

      track.scrollBy({
        left:
          direction ===
          'next'
            ? amount
            : -amount,
        behavior: 'smooth',
      });
    };

  return (
    <section
      className={
        styles.section
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <h2
            className={
              styles.title
            }
          >
            {title}
          </h2>

          <p
            className={
              styles.description
            }
          >
            {description}
          </p>
        </div>

        <button
          type="button"
          className={
            styles.viewAll
          }
          onClick={
            onViewAll
          }
        >
          Ver todos

          <ArrowRight
            size={15}
            aria-hidden="true"
          />
        </button>
      </header>

      <div
        className={
          styles.carousel
        }
      >
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() =>
            scroll(
              'previous'
            )
          }
          aria-label={`Ver productos anteriores de ${title}`}
        >
          <ChevronLeft
            size={20}
            aria-hidden="true"
          />
        </button>

        <div
          ref={
            trackRef
          }
          className={
            styles.track
          }
        >
          {products.map(
            (product) => (
              <div
                key={
                  product.id
                }
                className={
                  styles.item
                }
              >
                <CatalogProductCard
                  product={
                    product
                  }
                />
              </div>
            )
          )}
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() =>
            scroll(
              'next'
            )
          }
          aria-label={`Ver más productos de ${title}`}
        >
          <ChevronRight
            size={20}
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
};

export default CatalogRow;
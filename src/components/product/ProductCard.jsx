import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  // Extraemos la primera foto del array 'images', o caemos en un fallback si está vacío
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/400x300';

  return (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <img
          src={mainImage}
          alt={product.name}
          className={styles.productImage}
        />

        {product.category && (
          <span className={styles.productBadge}>
            {product.category}
          </span>
        )}
      </div>

      <div className={styles.productContent}>
        <h3 className={styles.productTitle}>{product.name}</h3>

        <div className={styles.productFooter}>
          <span className={styles.productPrice}>
            {Number(product.price).toFixed(2)} €
          </span>

          <Link
            to={`/products/${product.id}`}
            className={styles.addCartBtn}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={styles.productImage} 
        />
        {product.category && (
          <span className={styles.productBadge}>{product.category}</span>
        )}
      </div>

      <div className={styles.productContent}>
        <h3 className={styles.productTitle}>{product.name}</h3>

        <div className={styles.productFooter}>
          <span className={styles.productPrice}>
            ${product.price.toFixed(2)}
          </span>
          
          <Link 
            to={`/products/${product.id}`}
            className={styles.addCartBtn}
            style={{ textDecoration: 'none' }}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return <p className={styles.empty}>No hay productos disponibles.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
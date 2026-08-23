import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem'
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
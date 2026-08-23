import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductGrid } from '../components/product/ProductGrid';

export const HomePage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Tecnología innovadora para la vida cotidiana</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Descubre nuestra selección de productos tecnológicos que mejoran tu día a día</p>
      
      <ProductGrid products={MOCK_PRODUCTS} />
    </div>
  );
};
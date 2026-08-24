import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';

const HomePage = () => {
  const homeParams = useMemo(() => ({ limit: 8 }), []);
  const { products = [], loading, error, refetch } = useProducts(homeParams);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1.25rem', fontWeight: '500' }}>
          {error}
        </p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
          Tecnología innovadora para la vida cotidiana
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Descubre nuestra selección de productos tecnológicos que mejoran tu día a día
        </p>
      </header>

      <section>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
          Productos Destacados
        </h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
};

export default HomePage;
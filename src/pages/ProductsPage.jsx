import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button/Button';

const CATEGORY_LABELS = {
  Productividad: 'Productividad',
  Workspace: 'Workspace',
  Audio: 'Audio',
  SmartHome: 'Smart Home',
  Creatividad: 'Creatividad',
};

const CATEGORIES = Object.keys(CATEGORY_LABELS);

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = useMemo(() => {
    const params = {};
    if (category) params.category = category;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    return params;
  }, [category, debouncedSearch]);

  const { products = [], loading, error, refetch } = useProducts(queryParams);

  return (
    <main style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            flex: '1',
            minWidth: '240px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <p>Cargando catálogo de productos...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: '#ef4444', marginBottom: '1.25rem', fontWeight: '500' }}>{error}</p>
          <Button onClick={refetch} variant="primary">
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          No se encontraron productos.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductGrid products={products} />
      )}
    </main>
  );
};

export default ProductsPage;
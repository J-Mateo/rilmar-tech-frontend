import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Producto no encontrado</h2>
        <Link to="/products" style={{ color: 'var(--color-accent)', marginTop: '1rem', display: 'inline-block' }}>
          &larr; Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', padding: '2rem 0' }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>{product.category}</span>
        <h1 style={{ fontSize: '2.25rem', margin: '0.5rem 0 1rem 0' }}>{product.name}</h1>
        <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>${product.price.toFixed(2)}</p>
        
        {/* Selector de cantidad con useState */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer' }}
          >-</button>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{quantity}</span>
          <button 
            onClick={() => setQuantity((prev) => prev + 1)}
            style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', cursor: 'pointer' }}
          >+</button>
        </div>

        <button style={{ backgroundColor: '#0f172a', color: 'white', padding: '1rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          Añadir al Carrito ({quantity})
        </button>

        <Link to="/products" style={{ marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          &larr; Volver al catálogo
        </Link>
      </div>
    </div>
  );
};
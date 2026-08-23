import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>Página no encontrada</p>
      <Link to="/" style={{ backgroundColor: '#0f172a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '4px', textDecoration: 'none' }}>
        Volver al inicio
      </Link>
    </div>
  );
};
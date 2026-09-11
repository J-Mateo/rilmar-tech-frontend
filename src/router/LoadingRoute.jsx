const LoadingRoute = () => (
  <div
    style={{
      minHeight: '40vh',
      display: 'grid',
      placeItems: 'center',
      color: '#64748b',
    }}
    role="status"
    aria-live="polite"
  >
    Cargando...
  </div>
);

export default LoadingRoute;
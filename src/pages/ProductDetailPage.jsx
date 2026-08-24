import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Truck, RefreshCw, ShieldCheck, Star, MessageSquare } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import Button from '../components/common/Button/Button';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { product, loading, error } = useProduct(id);

  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : ['https://via.placeholder.com/500x400?text=Sin+imagen'];

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) return <div className={styles.stateMessage}>Cargando detalle del producto...</div>;
  if (error || !product) return <div className={styles.stateMessage}>Producto no encontrado.</div>;

  const currentImg = selectedImage || images[0];

  return (
    <div className={styles.container}>
      {/* Navegación Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/products" className={styles.breadcrumbLink}>Catálogo</Link>
        <span>/</span>
        <span style={{ textTransform: 'capitalize' }}>{product.category?.toLowerCase()}</span>
      </nav>

      <div className={styles.grid}>
        {/* Galería de Imágenes */}
        <div>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className={styles.mainImageWrapper}
          >
            <img
              src={currentImg}
              alt={product.name}
              className={styles.mainImage}
              style={{
                transition: isHovered ? 'none' : 'transform 0.3s ease',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isHovered ? 'scale(2)' : 'scale(1)',
              }}
            />
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnailList}>
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setSelectedImage(imgUrl)}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`${styles.thumbnailBtn} ${currentImg === imgUrl ? styles.thumbnailBtnActive : ''}`}
                >
                  <img src={imgUrl} alt="" className={styles.thumbnailImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna de Información */}
        <div>
          <h1 className={styles.productTitle}>{product.name}</h1>

          {/* Valoraciones */}
          <div className={styles.ratingWrapper}>
            <span className={styles.ratingValue}>4.5</span>
            <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
              <Star size={16} fill="#f59e0b" />
              <Star size={16} fill="#f59e0b" />
              <Star size={16} fill="#f59e0b" />
              <Star size={16} fill="#f59e0b" />
              <Star size={16} color="#cbd5e1" />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MessageSquare size={14} /> 10 opiniones
            </span>
          </div>

          <p className={styles.categoryTag}>{product.category}</p>
          <div className={styles.price}>{Number(product.price).toFixed(2)} €</div>

          {/* Botones de Acción */}
          <div className={styles.actionButtons}>
            <Button variant="primary" style={{ borderRadius: '9999px', padding: '1rem' }}>
              <ShoppingCart size={18} /> AÑADIR AL CARRITO
            </Button>

            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className={`${styles.wishlistBtn} ${isWishlist ? styles.wishlistBtnActive : ''}`}
            >
              <Heart size={16} fill={isWishlist ? '#e11d48' : 'none'} />
              {isWishlist ? 'EN TU LISTA DE DESEOS' : 'AÑADIR A LA LISTA DE DESEOS'}
            </button>
          </div>

          {/* Bloque de Garantías */}
          <div className={styles.guaranteesBox}>
            <div className={styles.guaranteeItem}>
              <Truck size={18} color="#0f172a" /> ENVÍO GRATUITO (DE 24 A 48 HORAS)
            </div>
            <div className={styles.guaranteeItem}>
              <RefreshCw size={18} color="#0f172a" /> 30 DÍAS DE PRUEBA SIN COMPROMISO
            </div>
            <div className={styles.guaranteeItem}>
              <ShieldCheck size={18} color="#0f172a" /> 3 AÑOS DE GARANTÍA OFICIAL
            </div>
          </div>

          {/* Descripción */}
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
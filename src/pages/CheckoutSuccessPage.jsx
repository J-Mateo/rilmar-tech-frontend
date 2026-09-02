import {
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectLastOrder,
} from '../store/slices/cartSlice';

import styles from './CheckoutSuccessPage.module.css';

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'long',
  timeStyle: 'short',
});

const CheckoutSuccessPage = () => {
  const order = useSelector(selectLastOrder);

  if (!order) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <div className={styles.iconWrapper}>
            <ShoppingBag
              size={34}
              aria-hidden="true"
            />
          </div>

          <h1 className={styles.title}>
            No hay un pedido reciente disponible
          </h1>

          <p className={styles.message}>
            El resumen de la compra ya no está disponible en esta sesión.
          </p>

          <Link
            to="/products"
            className={styles.primaryLink}
          >
            Volver al catálogo
          </Link>
        </section>
      </main>
    );
  }

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <main className={styles.page}>
      <section className={styles.successCard}>
        <div className={styles.iconWrapperSuccess}>
          <CheckCircle2
            size={38}
            aria-hidden="true"
          />
        </div>

        <p className={styles.eyebrow}>
          Pedido confirmado
        </p>

        <h1 className={styles.title}>
          ¡Compra realizada con éxito!
        </h1>

        <p className={styles.message}>
          Hemos recibido tu pedido correctamente.
        </p>

        <div className={styles.orderMeta}>
          <div>
            <span className={styles.metaLabel}>
              Pedido
            </span>

            <strong className={styles.metaValue}>
              #{order.id}
            </strong>
          </div>

          <div>
            <span className={styles.metaLabel}>
              Fecha
            </span>

            <strong className={styles.metaValue}>
              {order.createdAt
                ? dateFormatter.format(
                    new Date(order.createdAt)
                  )
                : 'No disponible'}
            </strong>
          </div>
        </div>

        <div className={styles.divider} />

        <section
          className={styles.orderItems}
          aria-labelledby="order-items-title"
        >
          <h2
            id="order-items-title"
            className={styles.sectionTitle}
          >
            Productos
          </h2>

          <div className={styles.items}>
            {items.map((item) => {
              const product = item.product;

              const image =
                Array.isArray(product?.images) &&
                product.images.length > 0
                  ? product.images[0]
                  : 'https://via.placeholder.com/140x140?text=Sin+imagen';

              const quantity = Number(
                item.quantity || 0
              );

              const priceAtPurchase = Number(
                item.priceAtPurchase || 0
              );

              const subtotal =
                quantity * priceAtPurchase;

              return (
                <article
                  key={item.id}
                  className={styles.item}
                >
                  <img
                    src={image}
                    alt={product?.name || 'Producto'}
                    className={styles.image}
                  />

                  <div className={styles.itemInfo}>
                    <h3 className={styles.productName}>
                      {product?.name}
                    </h3>

                    <p className={styles.itemMeta}>
                      {quantity} ×{' '}
                      {currencyFormatter.format(
                        priceAtPurchase
                      )}
                    </p>
                  </div>

                  <strong
                    className={styles.itemSubtotal}
                  >
                    {currencyFormatter.format(
                      subtotal
                    )}
                  </strong>
                </article>
              );
            })}
          </div>
        </section>

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span>Total pagado</span>

          <strong>
            {currencyFormatter.format(
              Number(order.total || 0)
            )}
          </strong>
        </div>

        <div className={styles.actions}>
          <Link
            to="/products"
            className={styles.primaryLink}
          >
            Seguir comprando
          </Link>

          <Link
            to="/profile"
            className={styles.secondaryLink}
          >
            Ir a mi perfil
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CheckoutSuccessPage;
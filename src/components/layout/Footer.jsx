import {
  Heart,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link
              to="/"
              className={styles.logo}
              aria-label="Rilmar Tech - Inicio"
            >
              RILMAR<span>TECH</span>
            </Link>

            <p className={styles.tagline}>
              Tecnología que hace mejor tu día
              a día.
            </p>
          </div>

          <nav
            className={styles.column}
            aria-label="Compra"
          >
            <h2>Compra</h2>

            <Link to="/products">
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />
              Catálogo
            </Link>

            <Link to="/wishlist">
              <Heart
                size={15}
                aria-hidden="true"
              />
              Favoritos
            </Link>
          </nav>

          <nav
            className={styles.column}
            aria-label="Tu cuenta"
          >
            <h2>Tu cuenta</h2>

            <Link to="/profile">
              <UserRound
                size={15}
                aria-hidden="true"
              />
              Mi perfil
            </Link>

            <Link to="/cart">
              <ShoppingBag
                size={15}
                aria-hidden="true"
              />
              Mi carrito
            </Link>
          </nav>

          <div className={styles.about}>
            <h2>Sobre Rilmar Tech</h2>

            <p>
              Tecnología útil, accesible y pensada
              para integrarse de forma natural en
              tu día a día.
            </p>

            <Link
              to="/about"
              className={styles.aboutLink}
            >
              Conócenos
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; 2026 RILMARTECH. Todos los
            derechos reservados.
          </p>

          <p>
            Compra segura mediante Stripe.
          </p>
        </div>
      </div>
    </footer>
  );
};
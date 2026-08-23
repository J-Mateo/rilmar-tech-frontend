import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <button
          className={styles.menuToggleBtn}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className={styles.logo} onClick={closeMenu}>
          RILMAR<span>TECH</span>
        </Link>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.navOpen : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={closeMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={closeMenu}
          >
            Catálogo
          </NavLink>
        </nav>

        <div className={styles.headerActions}>
          <Link to="/products" className={styles.iconBtn}>
            <Search size={20} />
          </Link>
          <Link to="/login" className={styles.iconBtn}>
            <User size={20} />
          </Link>
          <button className={`${styles.iconBtn} ${styles.cartBtn}`}>
            <ShoppingBag size={20} />
            <span className={styles.cartBadge}>0</span>
          </button>
        </div>
      </div>
    </header>
  );
};
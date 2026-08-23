import { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import styles from './ProductsPage.module.css';

const CATEGORIES = ['Todas', 'Productividad', 'Workspace', 'Audio', 'Smart Home', 'Creatividad'];

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Catálogo Completo</h1>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.categoryGroup}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryBtn} ${
                selectedCategory === cat ? styles.categoryBtnActive : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
};
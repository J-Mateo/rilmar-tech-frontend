import {
  useState,
} from 'react';

import styles from './ProductForm.module.css';

const CATEGORY_OPTIONS = [
  'Workspace',
  'Productividad',
  'Creatividad',
  'Smart Home',
  'Audio',
];

const createInitialForm = (
  product
) => ({
  name:
    product?.name ?? '',

  category:
    product?.category ?? '',

  description:
    product?.description ?? '',

  price:
    product?.price != null
      ? String(product.price)
      : '',

  stock:
    product?.stock != null
      ? String(product.stock)
      : '0',
});

const ProductForm = ({
  product = null,
  submitting = false,
  error = '',
  onSubmit,
}) => {
  const [
    form,
    setForm,
  ] = useState(() =>
    createInitialForm(
      product
    )
  );

  const [
    images,
    setImages,
  ] = useState([]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]:
          value,
      })
    );
  };

  const handleImagesChange = (
    event
  ) => {
    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );

    setImages(
      selectedFiles
    );
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const formData =
      new FormData();

    formData.append(
      'name',
      form.name.trim()
    );

    formData.append(
      'category',
      form.category
    );

    formData.append(
      'description',
      form.description.trim()
    );

    formData.append(
      'price',
      form.price.trim()
    );

    formData.append(
      'stock',
      form.stock
    );

    if (
      product?.images?.length
    ) {
      product.images.forEach(
        (url) => {
          formData.append(
            'images',
            url
          );
        }
      );
    }

    images.forEach(
      (file) => {
        formData.append(
          'images',
          file
        );
      }
    );

    onSubmit(
      formData
    );
  };

  const hasLegacyCategory =
    Boolean(
      form.category &&
      !CATEGORY_OPTIONS.includes(
        form.category
      )
    );

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="name">
            Nombre
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            maxLength={150}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">
            Categoría
          </label>

          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Selecciona una categoría
            </option>

            {hasLegacyCategory && (
              <option
                value={form.category}
              >
                {form.category}
              </option>
            )}

            {CATEGORY_OPTIONS.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="price">
            Precio
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="stock">
            Stock
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="description">
          Descripción
        </label>

        <textarea
          id="description"
          name="description"
          rows={7}
          value={
            form.description
          }
          onChange={
            handleChange
          }
          maxLength={5000}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="images">
          Imágenes
        </label>

        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={
            handleImagesChange
          }
        />

        <p className={styles.help}>
          Puedes seleccionar hasta 6 imágenes.
          Se almacenarán mediante Cloudinary.
        </p>

        {images.length > 0 && (
          <p className={styles.help}>
            {images.length}{' '}
            {images.length === 1
              ? 'imagen seleccionada'
              : 'imágenes seleccionadas'}
          </p>
        )}
      </div>

      {product?.images?.length > 0 && (
        <div
          className={
            styles.currentImage
          }
        >
          <p>
            Imágenes actuales
          </p>

          {product.images.map(
            (imageUrl) => (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={product.name}
              />
            )
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={submitting}
          className={
            styles.submitButton
          }
        >
          {submitting
            ? 'Guardando...'
            : product
              ? 'Guardar cambios'
              : 'Crear producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
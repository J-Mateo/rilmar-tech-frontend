import {
  useState,
} from 'react';

import {
  Trash2,
} from 'lucide-react';

import styles from './ProductForm.module.css';

const CATEGORY_OPTIONS = [
  'Workspace',
  'Productividad',
  'Creatividad',
  'Smart Home',
  'Audio',
];

const MAX_IMAGES = 6;

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
    existingImages,
    setExistingImages,
  ] = useState(
    () =>
      Array.isArray(
        product?.images
      )
        ? product.images
        : []
  );

  const [
    images,
    setImages,
  ] = useState([]);

  const [
    imageError,
    setImageError,
  ] = useState('');

  const totalImages =
    existingImages.length +
    images.length;

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

    const availableSlots =
      MAX_IMAGES -
      existingImages.length;

    if (
      selectedFiles.length >
      availableSlots
    ) {
      setImages([]);

      setImageError(
        `Puedes tener un máximo de ${MAX_IMAGES} imágenes en total.`
      );

      event.target.value =
        '';

      return;
    }

    setImages(
      selectedFiles
    );

    setImageError('');
  };

  const handleRemoveExistingImage = (
    imageUrl
  ) => {
    setExistingImages(
      (current) =>
        current.filter(
          (url) =>
            url !== imageUrl
        )
    );

    setImageError('');
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (
      totalImages >
      MAX_IMAGES
    ) {
      setImageError(
        `Puedes tener un máximo de ${MAX_IMAGES} imágenes en total.`
      );

      return;
    }

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

    existingImages.forEach(
      (url) => {
        formData.append(
          'images',
          url
        );
      }
    );

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
          Puedes tener hasta {MAX_IMAGES}{' '}
          imágenes por producto. Las nuevas
          imágenes se almacenarán mediante
          Cloudinary.
        </p>

        <p className={styles.help}>
          {totalImages} / {MAX_IMAGES}{' '}
          imágenes
        </p>

        {images.length > 0 && (
          <p className={styles.help}>
            {images.length}{' '}
            {images.length === 1
              ? 'imagen nueva seleccionada'
              : 'imágenes nuevas seleccionadas'}
          </p>
        )}

        {imageError && (
          <div
            className={styles.error}
            role="alert"
          >
            {imageError}
          </div>
        )}
      </div>

      {existingImages.length > 0 && (
        <div
          className={
            styles.currentImage
          }
        >
          <p>
            Imágenes actuales
          </p>

          <div
            className={
              styles.currentImagesGrid
            }
          >
            {existingImages.map(
              (imageUrl) => (
                <div
                  key={imageUrl}
                  className={
                    styles.currentImageItem
                  }
                >
                  <img
                    src={imageUrl}
                    alt={product?.name ?? 'Producto'}
                  />

                  <button
                    type="button"
                    className={
                      styles.removeImageButton
                    }
                    onClick={() =>
                      handleRemoveExistingImage(
                        imageUrl
                      )
                    }
                    aria-label="Eliminar imagen del producto"
                    title="Eliminar imagen"
                  >
                    <Trash2
                      size={18}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )
            )}
          </div>

          <p className={styles.help}>
            Las imágenes eliminadas dejarán
            de estar asociadas al producto
            cuando guardes los cambios.
          </p>
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
import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import ProductForm from '../../components/product/ProductForm';

import {
  createProductApi,
  getAdminProductById,
  updateProductApi,
} from '../../api/products.api';

import styles from './AdminProductForm.module.css';

const AdminProductForm = () => {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const isEditing =
    Boolean(id);

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(
    isEditing
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    if (!isEditing) {
      return undefined;
    }

    const controller =
      new AbortController();

    const loadProduct =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await getAdminProductById(
              id,
              {
                signal:
                  controller.signal,
              }
            );

          setProduct(
            response.data
          );
        } catch (
          requestError
        ) {
          if (
            requestError?.code ===
            'REQUEST_CANCELED'
          ) {
            return;
          }

          setError(
            requestError?.message ||
              'No se ha podido cargar el producto'
          );
        } finally {
          if (
            !controller
              .signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [
    id,
    isEditing,
  ]);

  const handleSubmit =
    async (formData) => {
      try {
        setSubmitting(true);
        setError('');

        if (isEditing) {
          await updateProductApi(
            id,
            formData
          );
        } else {
          await createProductApi(
            formData
          );
        }

        navigate(
          '/admin/products',
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        setError(
          requestError?.message ||
            'No se ha podido guardar el producto'
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <section>
      <div
        className={
          styles.header
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Catálogo
          </p>

          <h2
            className={
              styles.title
            }
          >
            {isEditing
              ? 'Editar producto'
              : 'Nuevo producto'}
          </h2>

          <p
            className={
              styles.description
            }
          >
            {isEditing
              ? 'Actualiza la información del producto.'
              : 'Añade un nuevo producto al catálogo.'}
          </p>
        </div>

        <Link
          to="/admin/products"
          className={
            styles.backLink
          }
        >
          Volver
        </Link>
      </div>

      {loading ? (
        <p>
          Cargando producto...
        </p>
      ) : (
        <ProductForm
          product={product}
          submitting={
            submitting
          }
          error={error}
          onSubmit={
            handleSubmit
          }
        />
      )}
    </section>
  );
};

export default AdminProductForm;
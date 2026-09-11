import {
  ShoppingBag,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  addCartItem,
  selectCartMutationLoading,
} from '../../store/slices/cartSlice';

import formatCurrency from '../../utils/formatCurrency';

import styles from './HomeProductCard.module.css';

const getProductImage = (product) =>
  product.images?.[0] ||
  product.image ||
  '/placeholder-product.png';

const HomeProductCard = ({
  product,
}) => {
  const dispatch =
    useDispatch();

  const cartMutationLoading =
    useSelector(
      selectCartMutationLoading
    );

  const isOutOfStock =
    Number(product.stock) <= 0;

  const handleAddToCart =
    async () => {
      if (
        isOutOfStock ||
        cartMutationLoading
      ) {
        return;
      }

      try {
        await dispatch(
          addCartItem({
            productId:
              product.id,
            quantity: 1,
          })
        ).unwrap();
      } catch {
        return;
      }
    };

  return (
    <article
      className={
        styles.card
      }
    >
      <div
        className={
          styles.visual
        }
      >
        <Link
          to={`/products/${product.id}`}
          className={
            styles.imageLink
          }
          aria-label={`Ver ${product.name}`}
        >
          <img
            src={
              getProductImage(
                product
              )
            }
            alt={
              product.name
            }
            className={
              styles.image
            }
            loading="lazy"
          />
        </Link>

        {!isOutOfStock && (
          <div
            className={
              styles.quickAction
            }
          >
            <button
              type="button"
              className={
                styles.cartButton
              }
              onClick={
                handleAddToCart
              }
              disabled={
                cartMutationLoading
              }
              aria-label={`Añadir ${product.name} al carrito`}
            >
              <ShoppingBag
                size={19}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>

      <div
        className={
          styles.info
        }
      >
        <div
          className={
            styles.meta
          }
        >
          {product.category && (
            <span
              className={
                styles.category
              }
            >
              {product.category}
            </span>
          )}

          {isOutOfStock && (
            <span
              className={
                styles.stock
              }
            >
              Agotado
            </span>
          )}
        </div>

        <Link
          to={`/products/${product.id}`}
          className={
            styles.name
          }
        >
          {product.name}
        </Link>

        <span
          className={
            styles.price
          }
        >
          {formatCurrency(
            product.price
          )}
        </span>
      </div>
    </article>
  );
};

export default HomeProductCard;


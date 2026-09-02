import { useState } from 'react';
import { Star } from 'lucide-react';

import { createReview } from '../../../api/reviews.api';
import Button from '../../common/Button/Button';

import styles from './ReviewForm.module.css';

const ReviewForm = ({
  productId,
  onReviewCreated,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedComment = comment.trim();

    if (rating < 1 || rating > 5) {
      setError('Selecciona una valoración entre 1 y 5.');
      return;
    }

    if (!normalizedComment) {
      setError('Escribe un comentario para publicar la reseña.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createReview(productId, {
        rating,
        comment: normalizedComment,
      });

      setRating(0);
      setComment('');

      await onReviewCreated();
    } catch (requestError) {
      setError(
        requestError?.message ||
          'No se ha podido publicar la reseña'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className={styles.title}>
        Escribe una reseña
      </h3>

      <div className={styles.ratingField}>
        <span className={styles.label}>
          Valoración
        </span>

        <div
          className={styles.ratingButtons}
          role="radiogroup"
          aria-label="Valoración del producto"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.starButton} ${
                value <= rating
                  ? styles.starButtonActive
                  : ''
              }`}
              onClick={() => {
                setRating(value);
                setError(null);
              }}
              aria-label={`${value} ${
                value === 1
                  ? 'estrella'
                  : 'estrellas'
              }`}
              aria-pressed={rating === value}
              disabled={submitting}
            >
              <Star
                size={24}
                fill={
                  value <= rating
                    ? 'currentColor'
                    : 'none'
                }
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.commentField}>
        <label
          htmlFor="review-comment"
          className={styles.label}
        >
          Comentario
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);

            if (error) {
              setError(null);
            }
          }}
          rows={5}
          maxLength={1000}
          placeholder="Cuéntanos tu experiencia con este producto..."
          className={styles.textarea}
          disabled={submitting}
          required
        />

        <span className={styles.characterCount}>
          {comment.length}/1000
        </span>
      </div>

      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={submitting}
        disabled={submitting}
        className={styles.submitButton}
      >
        Publicar reseña
      </Button>
    </form>
  );
};

export default ReviewForm;
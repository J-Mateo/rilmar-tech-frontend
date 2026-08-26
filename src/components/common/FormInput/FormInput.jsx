import { forwardRef } from 'react';

import styles from './FormInput.module.css';

const FormInput = forwardRef(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      error,
      placeholder,
      required = false,
      autoComplete,
    },
    ref
  ) => {
    return (
      <div className={styles.field}>
        {label && (
          <label
            htmlFor={name}
            className={styles.label}
          >
            {label}

            {required && (
              <>
                {' '}
                <span
                  className={styles.required}
                  aria-hidden="true"
                >
                  *
                </span>
              </>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${name}-error` : undefined
          }
          className={`${styles.input} ${
            error ? styles.inputError : ''
          }`}
        />

        {error && (
          <span
            id={`${name}-error`}
            className={styles.error}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
import {
  forwardRef,
  useState,
} from 'react';

import {
  Eye,
  EyeOff,
} from 'lucide-react';

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
    const isPassword =
      type === 'password';

    const [
      showPassword,
      setShowPassword,
    ] = useState(false);

    const resolvedType =
      isPassword && showPassword
        ? 'text'
        : type;

    return (
      <div
        className={
          styles.field
        }
      >
        {label && (
          <label
            htmlFor={name}
            className={
              styles.label
            }
          >
            {label}

            {required && (
              <>
                {' '}

                <span
                  className={
                    styles.required
                  }
                  aria-hidden="true"
                >
                  *
                </span>
              </>
            )}
          </label>
        )}

        <div
          className={
            isPassword
              ? styles.inputWrapper
              : undefined
          }
        >
          <input
            ref={ref}
            id={name}
            name={name}
            type={
              resolvedType
            }
            value={value}
            onChange={
              onChange
            }
            placeholder={
              placeholder
            }
            required={
              required
            }
            autoComplete={
              autoComplete
            }
            aria-invalid={
              Boolean(error)
            }
            aria-describedby={
              error
                ? `${name}-error`
                : undefined
            }
            className={`${styles.input} ${
              isPassword
                ? styles.passwordInput
                : ''
            } ${
              error
                ? styles.inputError
                : ''
            }`}
          />

          {isPassword && (
            <button
              type="button"
              className={
                styles.passwordToggle
              }
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              aria-label={
                showPassword
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              }
              aria-pressed={
                showPassword
              }
            >
              {showPassword ? (
                <Eye
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <EyeOff
                  size={18}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </div>

        {error && (
          <span
            id={`${name}-error`}
            className={
              styles.error
            }
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName =
  'FormInput';

export default FormInput;
import styles from './Button.module.css';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    disabled = false,
    onClick,
    className = '',
    ...props
}) => {
    const variantClass =
        styles[variant] || styles.primary;

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${styles.button} ${variantClass} ${className}`.trim()}
            {...props}
        >
            {isLoading ? 'Cargando...' : children}
        </button>
    );
};

export default Button;
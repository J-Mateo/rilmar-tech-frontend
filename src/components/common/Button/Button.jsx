const VARIANT_STYLES = {
    primary: {
        backgroundColor: '#000000',
        color: '#ffffff',
        border: '1px solid #000000',
    },
    secondary: {
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
        border: '1px solid #cbd5e1',
    },
    danger: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: '1px solid #ef4444',
    },
};

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    isLoading = false,
    disabled = false,
    onClick,
    style,
    ...props
}) => {
    const selectedStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: disabled || isLoading ? 0.6 : 1,
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                ...selectedStyle,
                ...style,
            }}
            {...props}
        >
            {isLoading ? 'Cargando...' : children}
        </button>
    );
};

export default Button;
import { forwardRef } from 'react';

const FormInput = forwardRef(({ label, name, type = 'text', value, onChange, error, placeholder, required = false, autoComplete }, ref) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {label && (
                <label htmlFor={name} style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                    {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
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
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: error ? '1px solid #dc2626' : '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.2s',
                }}
            />
            {error && <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{error}</span>}
        </div>
    );
});

FormInput.displayName = 'FormInput';

export default FormInput;
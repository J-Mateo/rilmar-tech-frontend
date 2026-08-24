import { forwardRef, useRef, useImperativeHandle } from 'react';

const FormInput = forwardRef(
    ({ label, name, type = 'text', value, onChange, error, placeholder, required = false, ...props }, ref) => {
        const inputRef = useRef(null);

        // Expone el nodo del DOM y métodos directos al componente padre
        useImperativeHandle(ref, () => ({
            focus: () => {
                inputRef.current?.focus();
            },
            select: () => {
                inputRef.current?.select();
            },
            element: inputRef.current,
        }));

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                {label && (
                    <label
                        htmlFor={name}
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#334155',
                        }}
                    >
                        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                )}

                <input
                    ref={inputRef}
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        transition: 'border-color 0.2s ease',
                    }}
                    {...props}
                />

                {error && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.1rem' }}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
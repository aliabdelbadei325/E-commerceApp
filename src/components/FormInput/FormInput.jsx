import { useState } from 'react';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';
import './FormInput.css';

/**
 * FormInput Component
 * Reusable form input with validation
 */
const FormInput = ({
    type = 'text',
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    success,
    required = false,
    disabled = false,
    icon,
    maxLength,
    autoComplete
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const inputClasses = [
        'form-input',
        'form-input-field',
        error && 'error',
        success && 'success',
        icon && 'has-icon'
    ].filter(Boolean).join(' ');

    const wrapperClasses = [
        'form-input-wrapper',
        isFocused && 'focused',
        error && 'has-error',
        success && 'has-success'
    ].filter(Boolean).join(' ');

    return (
        <div className="form-group form-input-group">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            <div className={wrapperClasses}>
                {icon && <span className="form-input-icon">{icon}</span>}

                {type === 'textarea' ? (
                    <textarea
                        id={name}
                        name={name}
                        className={inputClasses}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        maxLength={maxLength}
                        rows={4}
                    />
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        className={inputClasses}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        maxLength={maxLength}
                        autoComplete={autoComplete}
                    />
                )}

                {/* Status Icons */}
                {error && (
                    <span className="form-input-status error">
                        <FiAlertCircle />
                    </span>
                )}
                {success && !error && (
                    <span className="form-input-status success">
                        <FiCheck />
                    </span>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="form-error">
                    <FiAlertCircle className="form-error-icon" />
                    <span>{error}</span>
                </div>
            )}

            {/* Character Counter */}
            {maxLength && (
                <div className="form-char-count">
                    {value?.length || 0} / {maxLength}
                </div>
            )}
        </div>
    );
};

export default FormInput;

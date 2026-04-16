/**
 * Form Validation Utilities
 * Clean, reusable validation functions
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
    if (!email || email.trim() === '') {
        return { isValid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
        return { isValid: false, message: 'Phone number is required' };
    }

    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { isValid: false, message: 'Please enter a valid phone number (10-15 digits)' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || value.trim() === '') {
        return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates name (first name, last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateName = (name, fieldName = 'Name') => {
    if (!name || name.trim() === '') {
        return { isValid: false, message: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
        return { isValid: false, message: `${fieldName} must be at least 2 characters` };
    }

    if (name.trim().length > 50) {
        return { isValid: false, message: `${fieldName} must be less than 50 characters` };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
        return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates address
 * @param {string} address - Address to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
    if (!address || address.trim() === '') {
        return { isValid: false, message: 'Address is required' };
    }

    if (address.trim().length < 10) {
        return { isValid: false, message: 'Please enter a complete address' };
    }

    if (address.trim().length > 200) {
        return { isValid: false, message: 'Address must be less than 200 characters' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates postal/zip code
 * @param {string} postalCode - Postal code to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePostalCode = (postalCode) => {
    if (!postalCode || postalCode.trim() === '') {
        return { isValid: false, message: 'Postal code is required' };
    }

    // Generic validation - allows alphanumeric with optional spaces/hyphens
    const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
    if (!postalRegex.test(postalCode)) {
        return { isValid: false, message: 'Please enter a valid postal code' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates credit card number (basic Luhn algorithm check)
 * @param {string} cardNumber - Card number to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateCardNumber = (cardNumber) => {
    if (!cardNumber || cardNumber.trim() === '') {
        return { isValid: false, message: 'Card number is required' };
    }

    // Remove spaces and hyphens
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');

    // Check if all digits
    if (!/^\d+$/.test(cleanNumber)) {
        return { isValid: false, message: 'Card number must contain only digits' };
    }

    // Check length (most cards are 13-19 digits)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        return { isValid: false, message: 'Please enter a valid card number' };
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    if (sum % 10 !== 0) {
        return { isValid: false, message: 'Please enter a valid card number' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates expiry date (MM/YY format)
 * @param {string} expiry - Expiry date to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateExpiry = (expiry) => {
    if (!expiry || expiry.trim() === '') {
        return { isValid: false, message: 'Expiry date is required' };
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
        return { isValid: false, message: 'Please enter expiry in MM/YY format' };
    }

    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();

    if (expiryDate < now) {
        return { isValid: false, message: 'Card has expired' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates CVV
 * @param {string} cvv - CVV to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateCVV = (cvv) => {
    if (!cvv || cvv.trim() === '') {
        return { isValid: false, message: 'CVV is required' };
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        return { isValid: false, message: 'CVV must be 3 or 4 digits' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates entire checkout form
 * @param {object} formData - Form data object
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateCheckoutForm = (formData) => {
    const errors = {};

    const firstNameResult = validateName(formData.firstName, 'First name');
    if (!firstNameResult.isValid) errors.firstName = firstNameResult.message;

    const lastNameResult = validateName(formData.lastName, 'Last name');
    if (!lastNameResult.isValid) errors.lastName = lastNameResult.message;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) errors.email = emailResult.message;

    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.isValid) errors.phone = phoneResult.message;

    const addressResult = validateAddress(formData.address);
    if (!addressResult.isValid) errors.address = addressResult.message;

    const cityResult = validateRequired(formData.city, 'City');
    if (!cityResult.isValid) errors.city = cityResult.message;

    const postalCodeResult = validatePostalCode(formData.postalCode);
    if (!postalCodeResult.isValid) errors.postalCode = postalCodeResult.message;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validates password
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
    if (!password || password.trim() === '') {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates confirm password matches original
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return { isValid: false, message: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }

    return { isValid: true, message: '' };
};

/**
 * Validates login form
 * @param {object} formData - { email, password }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateLoginForm = (formData) => {
    const errors = {};

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) errors.email = emailResult.message;

    if (!formData.password || formData.password.trim() === '') {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validates registration form
 * @param {object} formData - { firstName, lastName, email, password, confirmPassword }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateRegisterForm = (formData) => {
    const errors = {};

    const firstNameResult = validateName(formData.firstName, 'First name');
    if (!firstNameResult.isValid) errors.firstName = firstNameResult.message;

    const lastNameResult = validateName(formData.lastName, 'Last name');
    if (!lastNameResult.isValid) errors.lastName = lastNameResult.message;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) errors.email = emailResult.message;

    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) errors.password = passwordResult.message;

    const confirmResult = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmResult.isValid) errors.confirmPassword = confirmResult.message;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


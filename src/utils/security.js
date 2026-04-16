/**
 * Security Utilities
 * XSS Prevention, Input Sanitization, Password Security
 */

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return input.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { strength: 'weak'|'medium'|'strong', score: number, requirements: object }
 */
export const validatePasswordStrength = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        noSpaces: !/\s/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'medium';

    return { strength, score, requirements };
};

/**
 * Simple password hash for demo purposes
 * In production, use bcrypt on the server
 * @param {string} password - Password to hash
 * @returns {string} - Hashed password
 */
export const hashPassword = (password) => {
    // Simple hash for demo - NOT for production use
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
};

/**
 * Generate a mock session token
 * @param {object} user - User object
 * @returns {string} - Session token
 */
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return 'token_' + btoa(JSON.stringify(payload));
};

/**
 * Verify and decode token
 * @param {string} token - Token to verify
 * @returns {object|null} - Decoded payload or null if invalid/expired
 */
export const verifyToken = (token) => {
    try {
        if (!token || !token.startsWith('token_')) return null;
        const payload = JSON.parse(atob(token.replace('token_', '')));
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
};

/**
 * Rate limiting storage
 */
const rateLimitStore = new Map();

/**
 * Check and update rate limit for an action
 * @param {string} key - Unique key for the action (e.g., email for login)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - { allowed: boolean, remainingAttempts: number, resetTime: number }
 */
export const checkRateLimit = (key, maxAttempts = 3, windowMs = 30000) => {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, {
            attempts: 1,
            resetTime: now + windowMs
        });
        return { allowed: true, remainingAttempts: maxAttempts - 1, resetTime: 0 };
    }

    if (record.attempts >= maxAttempts) {
        const timeLeft = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, remainingAttempts: 0, resetTime: timeLeft };
    }

    record.attempts++;
    rateLimitStore.set(key, record);

    return {
        allowed: true,
        remainingAttempts: maxAttempts - record.attempts,
        resetTime: 0
    };
};

/**
 * Reset rate limit for a key (on successful action)
 * @param {string} key - Key to reset
 */
export const resetRateLimit = (key) => {
    rateLimitStore.delete(key);
};

/**
 * Validate input for SQL injection patterns (for demo)
 * @param {string} input - Input to check
 * @returns {boolean} - True if safe
 */
export const isSafeInput = (input) => {
    if (typeof input !== 'string') return true;

    const dangerousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/i,
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/i,
        /on\w+\s*=/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
};

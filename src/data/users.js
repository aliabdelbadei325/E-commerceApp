/**
 * Mock Users Data
 * Demo accounts for testing authentication
 */

export const mockUsers = [
    {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@luxestore.com',
        password: 'Admin123!',
        role: 'admin',
        avatar: '👨‍💼',
        createdAt: '2025-01-01T00:00:00Z'
    },
    {
        id: 2,
        firstName: 'Staff',
        lastName: 'Member',
        email: 'staff@luxestore.com',
        password: 'Staff123!',
        role: 'staff',
        avatar: '👨‍💻',
        createdAt: '2025-01-15T00:00:00Z'
    },
    {
        id: 3,
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@luxestore.com',
        password: 'User123!',
        role: 'user',
        avatar: '👤',
        createdAt: '2025-02-01T00:00:00Z'
    }
];

/**
 * Get all users (without passwords)
 */
export const getUsers = () => {
    return mockUsers.map(({ password, ...user }) => user);
};

/**
 * Find user by email
 */
export const findUserByEmail = (email) => {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * Add new user
 */
export const addUser = (userData) => {
    const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        role: 'user',
        avatar: '👤',
        createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { ...newUser, password: undefined };
};

/**
 * Check if email exists
 */
export const emailExists = (email) => {
    return mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
};

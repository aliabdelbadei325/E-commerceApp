const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

// Sample Users
const users = [
    {
        firstName: "Ali",
        lastName: "Ali",
        email: "ali@example.com",
        password: "password123", // Will be hashed by pre-save hook
        role: "admin",
        avatar: "👑"
    },
    {
        firstName: "Staff",
        lastName: "Member",
        email: "staff@example.com",
        password: "password123",
        role: "staff",
        avatar: "🛠️"
    },
    {
        firstName: "John",
        lastName: "Doe",
        email: "user@example.com",
        password: "password123",
        role: "user",
        avatar: "👤"
    }
];

// Sample Products
const products = [
    {
        name: "Wireless Premium Headphones",
        price: 299.99,
        originalPrice: 399.99,
        description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 40-hour battery life.",
        category: "Electronics",
        rating: 4.8,
        reviewCount: 256,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        inStock: true,
        stockQuantity: 50,
        badges: ["best-seller"],
        featured: true
    },
    {
        name: "Smart Watch Pro",
        price: 449.99,
        originalPrice: 549.99,
        description: "Stay connected with health monitoring, GPS tracking, and seamless smartphone integration.",
        category: "Electronics",
        rating: 4.6,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        inStock: true,
        stockQuantity: 30,
        badges: ["new"],
        featured: true
    },
    {
        name: "Minimalist Leather Wallet",
        price: 79.99,
        description: "Handcrafted genuine leather wallet with RFID protection and slim design.",
        category: "Accessories",
        rating: 4.9,
        reviewCount: 412,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
        inStock: true,
        stockQuantity: 100,
        featured: false
    },
    {
        name: "Premium Sunglasses",
        price: 189.99,
        originalPrice: 249.99,
        description: "UV400 protection with polarized lenses and titanium frame for ultimate comfort.",
        category: "Accessories",
        rating: 4.7,
        reviewCount: 178,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        inStock: true,
        stockQuantity: 45,
        badges: ["sale"],
        featured: true
    },
    {
        name: "Wireless Earbuds Ultra",
        price: 179.99,
        originalPrice: 229.99,
        description: "Immersive sound with spatial audio, IPX7 water resistance, and 8-hour playtime.",
        category: "Electronics",
        rating: 4.5,
        reviewCount: 324,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        inStock: true,
        stockQuantity: 80,
        featured: false
    },
    {
        name: "Canvas Backpack",
        price: 129.99,
        description: "Durable canvas backpack with laptop compartment and anti-theft features.",
        category: "Bags",
        rating: 4.4,
        reviewCount: 267,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        inStock: true,
        stockQuantity: 60,
        featured: false
    },
    {
        name: "Mechanical Keyboard RGB",
        price: 159.99,
        originalPrice: 199.99,
        description: "Professional gaming keyboard with Cherry MX switches and customizable RGB lighting.",
        category: "Electronics",
        rating: 4.8,
        reviewCount: 543,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
        inStock: true,
        stockQuantity: 25,
        badges: ["popular"],
        featured: true
    },
    {
        name: "Minimalist Desk Lamp",
        price: 89.99,
        description: "LED desk lamp with adjustable brightness, color temperature, and wireless charging base.",
        category: "Accessories", // Mapped from 'home'
        rating: 4.6,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        inStock: true,
        stockQuantity: 40,
        featured: false
    },
    {
        name: "Portable Speaker",
        price: 119.99,
        originalPrice: 149.99,
        description: "360° surround sound with 24-hour battery life and waterproof design.",
        category: "Electronics",
        rating: 4.7,
        reviewCount: 289,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
        inStock: true,
        stockQuantity: 70,
        badges: ["sale"],
        featured: true
    },
    {
        name: "Leather Messenger Bag",
        price: 199.99,
        originalPrice: 259.99,
        description: "Premium full-grain leather messenger bag perfect for professionals on the go.",
        category: "Bags",
        rating: 4.9,
        reviewCount: 198,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
        inStock: false,
        stockQuantity: 0,
        badges: ["limited"],
        featured: true
    },
    {
        name: "Smart Home Hub",
        price: 129.99,
        description: "Control all your smart devices from one central hub with voice assistant support.",
        category: "Electronics",
        rating: 4.3,
        reviewCount: 167,
        image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
        inStock: true,
        stockQuantity: 35,
        featured: false
    },
    {
        name: "Premium Watch Stand",
        price: 49.99,
        description: "Elegant wooden watch stand with cushioned holder and jewelry tray.",
        category: "Accessories",
        rating: 4.5,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500",
        inStock: true,
        stockQuantity: 15,
        featured: false
    }
];
connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany(); // Clear users as well if requested, or just append
        // WARNING: This deletes ALL users including any you manually registered.
        // For a seeder in dev, this is usually acceptable.

        console.log('Data cleared');

        // Insert new data
        // We use create() instead of insertMany() for users to trigger the pre-save hook for password hashing
        for (const user of users) {
            await User.create(user);
        }

        await Product.insertMany(products);

        console.log('Data imported successfully (Users & Products)');

        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data destroyed');
        process.exit();
    } catch (error) {
        console.error('Error destroying data:', error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}

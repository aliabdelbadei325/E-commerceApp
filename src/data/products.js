/**
 * Sample Products Data
 * Mock data for E-commerce showcase
 */

export const products = [
  {
    id: 1,
    name: "Wireless Premium Headphones",
    price: 299.99,
    originalPrice: 399.99,
    description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 40-hour battery life.",
    category: "electronics",
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 449.99,
    originalPrice: 549.99,
    description: "Stay connected with health monitoring, GPS tracking, and seamless smartphone integration.",
    category: "electronics",
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    inStock: true,
    badge: "New"
  },
  {
    id: 3,
    name: "Minimalist Leather Wallet",
    price: 79.99,
    originalPrice: null,
    description: "Handcrafted genuine leather wallet with RFID protection and slim design.",
    category: "accessories",
    rating: 4.9,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    inStock: true,
    badge: null
  },
  {
    id: 4,
    name: "Premium Sunglasses",
    price: 189.99,
    originalPrice: 249.99,
    description: "UV400 protection with polarized lenses and titanium frame for ultimate comfort.",
    category: "accessories",
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    inStock: true,
    badge: "Sale"
  },
  {
    id: 5,
    name: "Wireless Earbuds Ultra",
    price: 179.99,
    originalPrice: 229.99,
    description: "Immersive sound with spatial audio, IPX7 water resistance, and 8-hour playtime.",
    category: "electronics",
    rating: 4.5,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    inStock: true,
    badge: null
  },
  {
    id: 6,
    name: "Canvas Backpack",
    price: 129.99,
    originalPrice: null,
    description: "Durable canvas backpack with laptop compartment and anti-theft features.",
    category: "bags",
    rating: 4.4,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    inStock: true,
    badge: null
  },
  {
    id: 7,
    name: "Mechanical Keyboard RGB",
    price: 159.99,
    originalPrice: 199.99,
    description: "Professional gaming keyboard with Cherry MX switches and customizable RGB lighting.",
    category: "electronics",
    rating: 4.8,
    reviews: 543,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
    inStock: true,
    badge: "Popular"
  },
  {
    id: 8,
    name: "Minimalist Desk Lamp",
    price: 89.99,
    originalPrice: null,
    description: "LED desk lamp with adjustable brightness, color temperature, and wireless charging base.",
    category: "home",
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    inStock: true,
    badge: null
  },
  {
    id: 9,
    name: "Portable Speaker",
    price: 119.99,
    originalPrice: 149.99,
    description: "360° surround sound with 24-hour battery life and waterproof design.",
    category: "electronics",
    rating: 4.7,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    inStock: true,
    badge: "Sale"
  },
  {
    id: 10,
    name: "Leather Messenger Bag",
    price: 199.99,
    originalPrice: 259.99,
    description: "Premium full-grain leather messenger bag perfect for professionals on the go.",
    category: "bags",
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    inStock: false,
    badge: "Limited"
  },
  {
    id: 11,
    name: "Smart Home Hub",
    price: 129.99,
    originalPrice: null,
    description: "Control all your smart devices from one central hub with voice assistant support.",
    category: "electronics",
    rating: 4.3,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
    inStock: true,
    badge: null
  },
  {
    id: 12,
    name: "Premium Watch Stand",
    price: 49.99,
    originalPrice: null,
    description: "Elegant wooden watch stand with cushioned holder and jewelry tray.",
    category: "accessories",
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500",
    inStock: true,
    badge: null
  }
];

export const categories = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "accessories", name: "Accessories", icon: "⌚" },
  { id: "bags", name: "Bags", icon: "👜" },
  { id: "home", name: "Home & Living", icon: "🏠" }
];

export const featuredCategories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest tech gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
    productCount: 156
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Style essentials",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500",
    productCount: 89
  },
  {
    id: "bags",
    name: "Bags & Luggage",
    description: "Travel in style",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
    productCount: 67
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  if (category === "all") return products;
  return products.filter(product => product.category === category);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

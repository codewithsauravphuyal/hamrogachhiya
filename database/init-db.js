const connectDB = require('./connection');
const { User, Address, Category, Store, Product, Order, Payment } = require('./mongoose-schema');
const bcrypt = require('bcryptjs');

// Initialize database with sample data
const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('🚀 Starting database initialization...');
    
    // Clear existing data (optional - remove in production)
    await clearExistingData();
    
    // Create sample data
    await createSampleData();
    
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearExistingData = async () => {
  console.log('🧹 Clearing existing data...');
  
  await User.deleteMany({});
  await Address.deleteMany({});
  await Category.deleteMany({});
  await Store.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Payment.deleteMany({});
  
  console.log('✅ Existing data cleared');
};

// Create sample data
const createSampleData = async () => {
  console.log('📝 Creating sample data...');
  
  // 1. Create Admin User
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@admin.com',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    phone: '+1234567890',
    isVerified: true,
    isActive: true
  });
  console.log('✅ Admin user created');
  
  // 2. Create Seller User
  const sellerUser = await User.create({
    name: 'Raju Thapa',
    email: 'raju@admin.com',
    password: await bcrypt.hash('seller123', 12),
    role: 'seller',
    phone: '+1234567891',
    isVerified: true,
    isActive: true
  });
  console.log('✅ Seller user created');
  
  // 3. Create Customer User
  const customerUser = await User.create({
    name: 'Saurav Phuyal',
    email: 'saurav@admin.com',
    password: await bcrypt.hash('customer123', 12),
    role: 'customer',
    phone: '+1234567892',
    isVerified: true,
    isActive: true
  });
  console.log('✅ Customer user created');
  
  // 4. Create Categories
  const categories = await Category.create([
    {
      name: 'Groceries',
      slug: 'groceries',
      description: 'Fresh groceries and household essentials',
      icon: '🛒',
      level: 0,
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronics and gadgets',
      icon: '📱',
      level: 0,
      isActive: true,
      sortOrder: 2
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy fashion and clothing',
      icon: '👕',
      level: 0,
      isActive: true,
      sortOrder: 3
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      icon: '🏠',
      level: 0,
      isActive: true,
      sortOrder: 4
    },
    {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh fruits and vegetables',
      icon: '🍎',
      level: 1,
      parent: null, // Will be updated after creation
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Dairy',
      slug: 'dairy',
      description: 'Fresh dairy products',
      icon: '🥛',
      level: 1,
      parent: null, // Will be updated after creation
      isActive: true,
      sortOrder: 2
    }
  ]);
  
  // Update parent references for subcategories
  const groceriesCategory = categories.find(cat => cat.slug === 'groceries');
  await Category.updateMany(
    { slug: { $in: ['fruits', 'dairy'] } },
    { parent: groceriesCategory._id }
  );
  
  console.log('✅ Categories created');
  
  // 5. Create Store
  const store = await Store.create({
    seller: sellerUser._id,
    name: 'Fresh Market',
    slug: 'fresh-market',
    description: 'Your local source for fresh organic produce and groceries',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: groceriesCategory._id,
    contactEmail: 'contact@freshmarket.com',
    contactPhone: '+1234567891',
    street: '123 Market St',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    country: 'USA',
    rating: 4.8,
    reviewCount: 1250,
    isVerified: true,
    isActive: true,
    allowReviews: true,
    autoAcceptOrders: false,
    minimumOrderAmount: 10.00
  });
  console.log('✅ Store created');
  
  // 6. Create Products
  const products = await Product.create([
    {
      store: store._id,
      name: 'Organic Fresh Apples',
      slug: 'organic-fresh-apples',
      description: 'Sweet and juicy organic apples from local farms. Perfect for healthy snacking and cooking.',
      shortDescription: 'Sweet and juicy organic apples',
      price: 4.99,
      originalPrice: 6.99,
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      category: groceriesCategory._id,
      subcategory: categories.find(cat => cat.slug === 'fruits')._id,
      brand: 'Fresh Farm',
      tags: ['organic', 'fresh', 'local', 'healthy'],
      stock: 50,
      sku: 'APPLE-ORG-001',
      weight: 0.5,
      rating: 4.5,
      reviewCount: 128,
      isActive: true,
      isFeatured: true,
      seoTitle: 'Organic Fresh Apples - Fresh Market',
      seoDescription: 'Buy fresh organic apples from local farms. Sweet, juicy, and healthy.',
      keywords: ['organic apples', 'fresh fruits', 'healthy snacks'],
      variants: [
        {
          name: 'Size',
          value: 'Small (6 pieces)',
          price: 4.99,
          stock: 20
        },
        {
          name: 'Size',
          value: 'Medium (8 pieces)',
          price: 6.99,
          stock: 15
        },
        {
          name: 'Size',
          value: 'Large (12 pieces)',
          price: 9.99,
          stock: 15
        }
      ]
    },
    {
      store: store._id,
      name: 'Fresh Milk',
      slug: 'fresh-milk',
      description: 'Pure and fresh milk from grass-fed cows. Rich in nutrients and perfect for daily consumption.',
      shortDescription: 'Pure and fresh milk from grass-fed cows',
      price: 3.99,
      originalPrice: 4.99,
      images: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      category: groceriesCategory._id,
      subcategory: categories.find(cat => cat.slug === 'dairy')._id,
      brand: 'Dairy Farm',
      tags: ['fresh', 'dairy', 'nutritious', 'organic'],
      stock: 100,
      sku: 'MILK-FRESH-001',
      weight: 1.0,
      rating: 4.7,
      reviewCount: 89,
      isActive: true,
      isFeatured: false,
      seoTitle: 'Fresh Milk - Dairy Farm',
      seoDescription: 'Pure and fresh milk from grass-fed cows. Rich in nutrients.',
      keywords: ['fresh milk', 'dairy', 'nutritious'],
      variants: [
        {
          name: 'Size',
          value: '1 Liter',
          price: 3.99,
          stock: 50
        },
        {
          name: 'Size',
          value: '2 Liters',
          price: 7.49,
          stock: 30
        },
        {
          name: 'Size',
          value: '500ml',
          price: 2.49,
          stock: 20
        }
      ]
    }
  ]);
  console.log('✅ Products created');
  
  // 7. Create Sample Address
  const address = await Address.create({
    user: customerUser._id,
    type: 'home',
    name: 'Saurav Phuyal',
    phone: '+1234567892',
    address: '456 Customer St',
    city: 'New York',
    state: 'NY',
    pincode: '10002',
    isDefault: true
  });
  console.log('✅ Sample address created');
  
  // 8. Create Sample Order
  const order = await Order.create({
    user: customerUser._id,
    orderNumber: 'ORD-2024-001',
    items: [
      {
        product: products[0]._id,
        quantity: 2,
        price: 4.99,
        total: 9.98
      },
      {
        product: products[1]._id,
        quantity: 1,
        price: 3.99,
        total: 3.99
      }
    ],
    subtotal: 13.97,
    tax: 1.12,
    deliveryFee: 0,
    total: 15.09,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryAddress: address._id,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    actualDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    trackingNumber: 'TRK123456789',
    trackingUrl: 'https://tracking.example.com/TRK123456789'
  });
  console.log('✅ Sample order created');
  
  // 9. Create Sample Payment
  await Payment.create({
    order: order._id,
    user: customerUser._id,
    method: 'khalti',
    amount: 15.09,
    currency: 'USD',
    transactionId: 'TXN-2024-001',
    status: 'completed',
    gatewayResponse: {
      success: true,
      transactionId: 'TXN-2024-001',
      timestamp: new Date(),
      gateway: 'khalti'
    }
  });
  console.log('✅ Sample payment created');
  
  console.log('\n🎉 Database initialization completed!');
  console.log('\n📊 Sample Data Created:');
  console.log(`👥 Users: ${await User.countDocuments()}`);
  console.log(`📂 Categories: ${await Category.countDocuments()}`);
  console.log(`🏪 Stores: ${await Store.countDocuments()}`);
  console.log(`📦 Products: ${await Product.countDocuments()}`);
  console.log(`📋 Orders: ${await Order.countDocuments()}`);
  console.log(`💳 Payments: ${await Payment.countDocuments()}`);
  
  console.log('\n🔑 Login Credentials:');
  console.log('Admin: admin@admin.com / admin123');
  console.log('Seller: raju@admin.com / seller123');
  console.log('Customer: saurav@admin.com / customer123');
};

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 
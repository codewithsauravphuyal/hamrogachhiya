// Example usage patterns for GharKoSaman e-commerce database
// This file shows common operations and queries for both Mongoose and Prisma

// ============================================================================
// MONGOOSE EXAMPLES
// ============================================================================

const mongoose = require('mongoose');
const { User, Product, Order, Payment, Store, Category } = require('./mongoose-schema');

// Example 1: User Registration with Role
async function createUser() {
  try {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
      role: 'customer',
      phone: '+1234567890',
      isVerified: true
    });
    
    await user.save();
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Example 2: Create Store for Seller
async function createStore() {
  try {
    const store = new Store({
      seller: 'user_id_here',
      name: 'Fresh Market',
      slug: 'fresh-market',
      description: 'Your local source for fresh organic produce',
      contactEmail: 'contact@freshmarket.com',
      category: 'category_id_here',
      isVerified: true
    });
    
    await store.save();
    console.log('Store created:', store);
    return store;
  } catch (error) {
    console.error('Error creating store:', error);
  }
}

// Example 3: Create Product with Variants
async function createProduct() {
  try {
    const product = new Product({
      store: 'store_id_here',
      name: 'Organic Cotton T-Shirt',
      slug: 'organic-cotton-tshirt',
      description: 'Comfortable organic cotton t-shirt',
      price: 29.99,
      originalPrice: 39.99,
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      category: 'category_id_here',
      brand: 'EcoWear',
      tags: ['organic', 'cotton', 'sustainable'],
      stock: 100,
      variants: [
        {
          name: 'Size',
          value: 'S',
          price: 29.99,
          stock: 25
        },
        {
          name: 'Size',
          value: 'M',
          price: 29.99,
          stock: 30
        },
        {
          name: 'Size',
          value: 'L',
          price: 29.99,
          stock: 25
        }
      ],
      isActive: true
    });
    
    await product.save();
    console.log('Product created:', product);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

// Example 4: Create Order with Items
async function createOrder() {
  try {
    const order = new Order({
      user: 'user_id_here',
      orderNumber: 'ORD-2024-001',
      items: [
        {
          product: 'product_id_here',
          quantity: 2,
          price: 29.99,
          total: 59.98
        }
      ],
      subtotal: 59.98,
      tax: 4.80,
      deliveryFee: 0,
      total: 64.78,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryAddress: 'address_id_here',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    await order.save();
    console.log('Order created:', order);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

// Example 5: Create Payment
async function createPayment() {
  try {
    const payment = new Payment({
      order: 'order_id_here',
      user: 'user_id_here',
      method: 'khalti',
      amount: 64.78,
      currency: 'USD',
      transactionId: 'TXN-123456789',
      status: 'completed',
      gatewayResponse: {
        success: true,
        transactionId: 'TXN-123456789',
        timestamp: new Date()
      }
    });
    
    await payment.save();
    console.log('Payment created:', payment);
    return payment;
  } catch (error) {
    console.error('Error creating payment:', error);
  }
}

// Example 6: Complex Queries
async function complexQueries() {
  try {
    // Find all active products with price range
    const products = await Product.find({
      isActive: true,
      price: { $gte: 10, $lte: 100 }
    })
    .populate('store', 'name slug')
    .populate('category', 'name')
    .sort({ rating: -1, createdAt: -1 })
    .limit(20);
    
    console.log('Products found:', products.length);
    
    // Find orders by status with user details
    const orders = await Order.find({ status: 'pending' })
    .populate('user', 'name email')
    .populate('items.product', 'name price images')
    .populate('deliveryAddress')
    .sort({ createdAt: -1 });
    
    console.log('Pending orders:', orders.length);
    
    // Find stores with high ratings
    const topStores = await Store.find({
      isActive: true,
      rating: { $gte: 4.0 }
    })
    .populate('seller', 'name email')
    .populate('category', 'name')
    .sort({ rating: -1, reviewCount: -1 })
    .limit(10);
    
    console.log('Top stores:', topStores.length);
    
  } catch (error) {
    console.error('Error in complex queries:', error);
  }
}

// ============================================================================
// PRISMA EXAMPLES
// ============================================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example 1: User Registration with Role
async function createUserPrisma() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashedpassword123',
        role: 'SELLER',
        phone: '+1234567890',
        isVerified: true
      }
    });
    
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Example 2: Create Store with Relations
async function createStorePrisma() {
  try {
    const store = await prisma.store.create({
      data: {
        sellerId: 'user_id_here',
        name: 'Tech Gadgets',
        slug: 'tech-gadgets',
        description: 'Latest electronics and gadgets',
        contactEmail: 'contact@techgadgets.com',
        categoryId: 'category_id_here',
        isVerified: true,
        allowReviews: true,
        autoAcceptOrders: false,
        minimumOrderAmount: 10.00
      },
      include: {
        seller: true,
        category: true
      }
    });
    
    console.log('Store created:', store);
    return store;
  } catch (error) {
    console.error('Error creating store:', error);
  }
}

// Example 3: Create Product with Variants
async function createProductPrisma() {
  try {
    const product = await prisma.product.create({
      data: {
        storeId: 'store_id_here',
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 89.99,
        originalPrice: 129.99,
        images: [
          'https://example.com/headphones1.jpg',
          'https://example.com/headphones2.jpg'
        ],
        categoryId: 'category_id_here',
        brand: 'SoundPro',
        tags: ['wireless', 'bluetooth', 'noise-cancellation'],
        stock: 50,
        isActive: true,
        variants: {
          create: [
            {
              name: 'Color',
              value: 'Black',
              price: 89.99,
              stock: 25
            },
            {
              name: 'Color',
              value: 'White',
              price: 89.99,
              stock: 25
            }
          ]
        }
      },
      include: {
        store: true,
        category: true,
        variants: true
      }
    });
    
    console.log('Product created:', product);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

// Example 4: Create Order with Items
async function createOrderPrisma() {
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-002',
        userId: 'user_id_here',
        subtotal: 89.99,
        tax: 7.20,
        deliveryFee: 0,
        total: 97.19,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        deliveryAddressId: 'address_id_here',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        items: {
          create: [
            {
              productId: 'product_id_here',
              quantity: 1,
              price: 89.99,
              total: 89.99
            }
          ]
        }
      },
      include: {
        user: true,
        deliveryAddress: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('Order created:', order);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

// Example 5: Complex Prisma Queries
async function complexPrismaQueries() {
  try {
    // Find featured products with store and category info
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        price: {
          gte: 10,
          lte: 200
        }
      },
      include: {
        store: {
          select: {
            name: true,
            slug: true,
            rating: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        variants: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });
    
    console.log('Featured products:', featuredProducts.length);
    
    // Find orders by status with full details
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        deliveryAddress: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        },
        payments: {
          where: {
            status: 'PENDING'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Pending orders:', pendingOrders.length);
    
    // Find top-rated stores with product count
    const topStores = await prisma.store.findMany({
      where: {
        isActive: true,
        rating: {
          gte: 4.0
        }
      },
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        },
        category: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: 10
    });
    
    console.log('Top stores:', topStores.length);
    
  } catch (error) {
    console.error('Error in complex Prisma queries:', error);
  }
}

// ============================================================================
// INDEXING RECOMMENDATIONS
// ============================================================================

/*
MONGODB INDEXING RECOMMENDATIONS:

1. User Collection:
   - email: 1 (unique)
   - role: 1
   - isActive: 1
   - createdAt: -1

2. Product Collection:
   - store: 1
   - category: 1
   - isActive: 1
   - price: 1
   - rating: -1
   - tags: 1
   - name: "text", description: "text" (text search)
   - compound: [store, isActive, price]

3. Order Collection:
   - user: 1
   - status: 1
   - createdAt: -1
   - orderNumber: 1 (unique)
   - compound: [user, status]

4. Store Collection:
   - seller: 1
   - slug: 1 (unique)
   - isActive: 1
   - rating: -1

5. Payment Collection:
   - order: 1
   - transactionId: 1 (unique)
   - status: 1

POSTGRESQL INDEXING RECOMMENDATIONS:

1. Users table:
   - CREATE INDEX idx_users_email ON users(email);
   - CREATE INDEX idx_users_role ON users(role);
   - CREATE INDEX idx_users_active ON users(is_active);

2. Products table:
   - CREATE INDEX idx_products_store ON products(store_id);
   - CREATE INDEX idx_products_category ON products(category_id);
   - CREATE INDEX idx_products_active ON products(is_active);
   - CREATE INDEX idx_products_price ON products(price);
   - CREATE INDEX idx_products_rating ON products(rating DESC);
   - CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
   - CREATE INDEX idx_products_tags ON products USING GIN(tags);
   - CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));

3. Orders table:
   - CREATE INDEX idx_orders_user ON orders(user_id);
   - CREATE INDEX idx_orders_status ON orders(status);
   - CREATE INDEX idx_orders_created ON orders(created_at DESC);
   - CREATE INDEX idx_orders_number ON orders(order_number);

4. Payments table:
   - CREATE INDEX idx_payments_order ON payments(order_id);
   - CREATE INDEX idx_payments_transaction ON payments(transaction_id);
   - CREATE INDEX idx_payments_status ON payments(status);

5. Composite indexes for common queries:
   - CREATE INDEX idx_products_store_active ON products(store_id, is_active);
   - CREATE INDEX idx_orders_user_status ON orders(user_id, status);
   - CREATE INDEX idx_products_category_price ON products(category_id, price);
*/

module.exports = {
  // Mongoose functions
  createUser,
  createStore,
  createProduct,
  createOrder,
  createPayment,
  complexQueries,
  
  // Prisma functions
  createUserPrisma,
  createStorePrisma,
  createProductPrisma,
  createOrderPrisma,
  complexPrismaQueries
}; 
# Admin Dashboard Guide

## Overview
The admin dashboard is now fully functional with complete CRUD operations for managing the e-commerce platform. Admins can monitor all aspects of the platform including users, products, orders, stores, and revenue.

## Access
- **URL**: `http://localhost:3000/admin`
- **Test Login**: `http://localhost:3000/api/auth/test-login?email=admin@admin.com`
- **Credentials**: `admin@admin.com` / `admin123`

## Features

### 1. Dashboard Overview (`/admin`)
- **Statistics Cards**:
  - Total Users (customers)
  - Total Products (active)
  - Total Orders
  - Total Revenue
  - Pending Orders
- **Recent Orders**: Latest 5 orders with status and customer info
- **Recent Products**: Latest 5 products with store info
- **Quick Actions**: Links to manage products, orders, users, and stores

### 2. User Management (`/admin/users`)
- **View All Users**: List of all customers, sellers, and admins
- **Search & Filter**: By name, email, role, and status
- **Actions**:
  - View user details
  - Edit user information
  - Activate/Deactivate users
  - Delete users
- **API Endpoint**: `GET /api/admin/users`

### 3. Store Management (`/admin/stores`)
- **View All Stores**: List of all seller stores
- **Search & Filter**: By store name, seller, and verification status
- **Actions**:
  - View store details
  - Edit store information
  - Verify/Unverify stores
  - Delete stores
- **API Endpoint**: `GET /api/admin/stores`

### 4. Product Management (`/admin/products`)
- **View All Products**: List of all products across all stores
- **Search & Filter**: By product name, store, and status
- **Actions**:
  - View product details
  - Edit product information
  - Activate/Deactivate products
  - Delete products
- **API Endpoint**: `GET /api/admin/products`

### 5. Order Management (`/admin/orders`)
- **View All Orders**: List of all orders across the platform
- **Search & Filter**: By order number, customer, and status
- **Order Status Management**:
  - Pending → Confirmed → Packed → Shipped → Delivered
  - Cancel orders (pending/confirmed only)
- **Actions**:
  - View order details
  - Update order status
  - Cancel orders
- **API Endpoint**: `GET /api/admin/orders`

## API Endpoints

### Authentication
- `GET /api/auth/test-login?email=admin@admin.com` - Quick admin login (no password required)

### Admin Stats
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/products` - Get all products
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stores` - Get all stores

### Admin Actions
- `PUT /api/admin/orders` - Update order status
- `DELETE /api/admin/orders` - Delete order
- `PUT /api/admin/products` - Update product status
- `DELETE /api/admin/products` - Delete product
- `PUT /api/admin/users` - Update user status
- `DELETE /api/admin/users` - Delete user
- `PUT /api/admin/stores` - Update store status
- `DELETE /api/admin/stores` - Delete store

## Database Schema

### Sample Data Created
- **Users**: 3 (Admin, Seller, Customer)
- **Categories**: 6 (Electronics, Clothing, etc.)
- **Stores**: 1 (Fresh Market)
- **Products**: 2 (Fresh Milk, Organic Apples)
- **Orders**: 1 (Sample order)
- **Payments**: 1 (Sample payment)

### Test Credentials
```
Admin: admin@admin.com / admin123
Seller: raju@admin.com / seller123
Customer: saurav@admin.com / customer123
```

## Testing

### 1. Quick Test
1. Visit `http://localhost:3000/admin`
2. Use test login: `http://localhost:3000/api/auth/test-login?email=admin@admin.com`
3. Verify dashboard shows correct statistics

### 2. API Testing
Visit `http://localhost:3000/admin/test` to run comprehensive API tests

### 3. Manual Testing
1. **Dashboard**: Check all statistics are displayed correctly
2. **Users**: Navigate to `/admin/users` and test search/filter
3. **Stores**: Navigate to `/admin/stores` and test store management
4. **Products**: Navigate to `/admin/products` and test product management
5. **Orders**: Navigate to `/admin/orders` and test order status updates

## Navigation Structure

```
Admin Dashboard
├── Dashboard (/admin)
├── Users (/admin/users)
│   ├── View All Users
│   ├── Sellers
│   └── Customers
├── Stores (/admin/stores)
│   ├── Approve Sellers
│   └── Flagged Stores
├── Products (/admin/products)
│   ├── All Products
│   └── Reported Products
├── Orders (/admin/orders)
│   ├── All Orders
│   └── Order Issues
├── Payments
│   ├── Transactions
│   └── Platform Earnings
├── Banners
├── Blogs
├── Platform Settings
└── Support Tickets
```

## Security Features

1. **Role-Based Access Control**: Only admin users can access admin pages
2. **JWT Authentication**: All API calls require valid JWT tokens
3. **Input Validation**: All API endpoints validate input data
4. **Error Handling**: Comprehensive error handling and user feedback

## Troubleshooting

### Common Issues

1. **"Failed to load stats" Error**
   - Check if database is connected
   - Verify admin user exists in database
   - Run database initialization: `node database/init-db.js`

2. **Authentication Issues**
   - Clear browser storage
   - Use test login endpoint
   - Check JWT token expiration

3. **API Errors**
   - Check server logs for detailed error messages
   - Verify API endpoints are accessible
   - Test with Postman or similar tool

### Database Reset
```bash
node database/init-db.js
```

## Development Notes

- **Frontend**: Next.js 15.4.5 with TypeScript
- **Styling**: Tailwind CSS + ShadCN/UI
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens

## Future Enhancements

1. **Advanced Analytics**: Charts and graphs for better insights
2. **Bulk Operations**: Mass actions for products, orders, users
3. **Export Features**: CSV/Excel export for reports
4. **Real-time Updates**: WebSocket integration for live updates
5. **Audit Logs**: Track all admin actions
6. **Advanced Filtering**: Date ranges, price ranges, etc.
7. **Email Notifications**: Automated alerts for important events 
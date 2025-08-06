# Dashboard Testing Guide

## Quick Test Instructions

### 1. Start the Application
```bash
npm run dev
```

### 2. Test Admin Dashboard
1. Go to: http://localhost:3000/admin
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin123`
3. Test features:
   - View dashboard statistics
   - Navigate to Users page: http://localhost:3000/admin/users
   - Navigate to Stores page: http://localhost:3000/admin/stores
   - Check navigation sidebar for all admin links

### 3. Test Seller Dashboard
1. Go to: http://localhost:3000/seller
2. Login with:
   - Email: `raju@admin.com`
   - Password: `seller123`
3. Test features:
   - View seller statistics
   - Navigate to Products page: http://localhost:3000/seller/products
   - Navigate to Orders page: http://localhost:3000/seller/orders
   - Check low stock alerts
   - Test navigation sidebar

### 4. Test Customer Account
1. Go to: http://localhost:3000/login
2. Login with:
   - Email: `saurav@admin.com`
   - Password: `customer123`
3. Test customer features

## Expected Functionality

### Admin Dashboard
- ✅ Dashboard overview with platform statistics
- ✅ User management with search and filters
- ✅ Store management with status indicators
- ✅ Navigation sidebar with role-based menu
- ✅ Authentication and authorization
- ✅ Responsive design

### Seller Dashboard
- ✅ Dashboard overview with store statistics
- ✅ Product management with low stock alerts
- ✅ Order management with status updates
- ✅ Navigation sidebar with seller-specific menu
- ✅ Authentication and authorization
- ✅ Responsive design

## API Endpoints Tested

### Admin APIs
- ✅ `GET /api/admin/stats` - Platform statistics
- ✅ `GET /api/admin/users` - User management
- ✅ `GET /api/admin/stores` - Store management
- ✅ `GET /api/admin/orders` - Order management
- ✅ `GET /api/admin/products` - Product management

### Seller APIs
- ✅ `GET /api/seller/stats` - Seller statistics
- ✅ `GET /api/seller/products` - Seller products
- ✅ `GET /api/seller/orders` - Seller orders

### Authentication
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/test-login` - Test login

## Database Status
- ✅ MongoDB connection established
- ✅ Sample data loaded
- ✅ Users, stores, products, and orders created
- ✅ Proper relationships between collections

## Troubleshooting

### If login doesn't work:
1. Check if database is initialized: `npm run db:init`
2. Verify MongoDB connection
3. Check browser console for errors
4. Try the test login endpoint

### If pages don't load:
1. Check if development server is running
2. Verify all dependencies are installed
3. Check browser console for errors
4. Ensure proper authentication

### If API calls fail:
1. Check MongoDB connection
2. Verify JWT token is being sent
3. Check server logs for errors
4. Ensure proper authorization headers

## Sample Data Available

### Users
- **Admin**: admin@admin.com / admin123
- **Seller**: raju@admin.com / seller123  
- **Customer**: saurav@admin.com / customer123

### Stores
- **Fresh Market**: Managed by Raju Thapa

### Products
- **Organic Fresh Apples**: $4.99 (on sale from $6.99)
- **Fresh Milk**: $3.99 (on sale from $4.99)

### Orders
- Sample order with both products

## Next Steps

1. **Add more features**:
   - Product creation/editing forms
   - Order status update functionality
   - User profile management
   - Store settings configuration

2. **Enhance functionality**:
   - Real-time notifications
   - Advanced filtering and search
   - Data export capabilities
   - Analytics and reporting

3. **Improve UX**:
   - Loading states and error handling
   - Form validation
   - Success/error notifications
   - Mobile optimization

4. **Security**:
   - Input validation
   - Rate limiting
   - CSRF protection
   - Environment variable management 
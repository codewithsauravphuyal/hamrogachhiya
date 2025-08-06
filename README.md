# Blinkit E-commerce Platform

A modern e-commerce platform built with Next.js, featuring admin and seller dashboards with comprehensive management capabilities.

## Features

### Admin Dashboard (`/admin`)
- **Dashboard Overview**: View platform statistics, recent orders, and products
- **User Management**: Manage all users (admin, seller, customer)
- **Store Management**: Oversee all stores and their status
- **Product Management**: Monitor all products across the platform
- **Order Management**: Track all orders and their status

### Seller Dashboard (`/seller`)
- **Dashboard Overview**: View store statistics, recent orders, and low stock alerts
- **Product Management**: Add, edit, and manage your products
- **Order Management**: Process and fulfill customer orders
- **Store Settings**: Configure store preferences and settings

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blinkit
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database with sample data:
```bash
npm run db:init
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Dashboards

### Admin Dashboard
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with admin credentials:
   - **Email**: `admin@admin.com`
   - **Password**: `admin123`
3. Explore the admin features:
   - View platform statistics
   - Manage users at `/admin/users`
   - Manage stores at `/admin/stores`
   - Monitor products and orders

### Seller Dashboard
1. Navigate to [http://localhost:3000/seller](http://localhost:3000/seller)
2. Login with seller credentials:
   - **Email**: `raju@admin.com`
   - **Password**: `seller123`
3. Explore the seller features:
   - View store statistics and low stock alerts
   - Manage products at `/seller/products`
   - Process orders at `/seller/orders`

### Customer Account
- **Email**: `saurav@admin.com`
- **Password**: `customer123`

## API Endpoints

### Admin APIs
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stores` - Get all stores
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/products` - Get all products

### Seller APIs
- `GET /api/seller/stats` - Get seller statistics
- `GET /api/seller/products` - Get seller's products
- `GET /api/seller/orders` - Get seller's orders

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/test-login` - Test login (skips password verification)

## Database Schema

The application uses MongoDB with the following main collections:
- **Users**: Admin, seller, and customer accounts
- **Stores**: Seller store information
- **Products**: Product catalog with variants
- **Orders**: Customer orders with items
- **Categories**: Product categories
- **Payments**: Payment transactions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **UI Components**: Lucide React icons

## Project Structure

```
blinkit/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── seller/            # Seller dashboard pages
│   ├── api/               # API routes
│   └── ...                # Other pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── ...               # Other components
├── database/             # Database configuration
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── ...
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:init` - Initialize database with sample data
- `npm run db:connect` - Test database connection

### Environment Variables
Create a `.env.local` file with:
```
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection without models
    const MONGODB_URI = 'mongodb+srv://codewithsauravphuyal:wvLBgSrkRQBR4CUN@cluster0.vylmvif.mongodb.net/gharkosaman';
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };
    
    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ Database connected successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    
    // Test basic database operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log('📂 Collections found:', collectionNames);
    
    // Get document counts for each collection
    const counts = {};
    for (const collectionName of collectionNames) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        counts[collectionName] = count;
      } catch (error) {
        console.log(`⚠️ Could not count ${collectionName}:`, error.message);
        counts[collectionName] = 'error';
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        database: conn.connection.name,
        host: conn.connection.host,
        collections: collectionNames,
        counts: counts,
        connectionState: conn.connection.readyState
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection test error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
} 
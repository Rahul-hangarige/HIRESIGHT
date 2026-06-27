import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load environment configurations
dotenv.config({ override: true });

console.log(`[Database Configuration] Connecting to URI: ${process.env.MONGODB_URI}`);

// Establish Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`HireSight Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shut down helpers
process.on('unhandledRejection', (err, promise) => {
  console.error(`Logged Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

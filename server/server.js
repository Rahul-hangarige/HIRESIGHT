import app from './app.js';

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

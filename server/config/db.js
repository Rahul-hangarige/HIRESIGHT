import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`
===================================================================
[WARNING] DATABASE CONNECTION FAILED:
${error.message}

Please make sure you have:
1. Started your local MongoDB service (e.g. net start MongoDB)
   OR
2. Configured MONGODB_URI in server/.env with a valid Atlas URL.

The server will continue running, but DB actions will return errors.
===================================================================
`);
  }
};

export default connectDB;

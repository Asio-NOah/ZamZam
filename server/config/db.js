const mongoose = require('mongoose');
require('dotenv').config();

let dbConnection; // Store the connection
let mongoClient; // Store the client

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    dbConnection = conn.connection; // Store the connection for later use
    mongoClient = conn; // Store the client for later use
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit the process with an error code
  }
};

const getConnection = () => {
  if (!dbConnection) {
    throw new Error('MongoDB connection not initialized. Call connectDB first.');
  }
  return dbConnection;
};

const getClient = () => {
  if (!mongoClient) {
    throw new Error('MongoDB client not initialized. Call connectDB first.');
  }
  return mongoClient;
};

module.exports = { connectDB, getConnection, getClient };

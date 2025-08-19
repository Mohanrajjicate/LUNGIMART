import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Add SSL configuration for Hostinger if required
  // ssl: {
  //   rejectUnauthorized: false 
  // }
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to the database.');
    conn.release();
  })
  .catch(err => {
    console.error('Failed to connect to the database. Please check your .env file and Hostinger settings.', err);
  });

export default pool;

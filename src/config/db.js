// import pkg from "pg";
// const { Pool } = pkg;
// import dotenv from "dotenv";

// dotenv.config();


// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 5432,
//   ssl: {
//     rejectUnauthorized: false // Required for AWS RDS
//   }
// });

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('Database connection error:', err);
// });

// export default pool;


// src/config/db.js - Debug Version
import { Pool } from "pg";

const pool = new Pool({
  host: "testing.cp2me0g2cf1v.ap-south-1.rds.amazonaws.com",
  user: "postgres",
  password: "L3vC12vMD1y6qU3fmmiB",
  database: "postgres",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("✅ Database pool created successfully");

export default pool;
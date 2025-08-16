
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
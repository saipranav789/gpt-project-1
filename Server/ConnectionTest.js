import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Add SSL configuration
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection error:", err);
  } else {
    console.log("Connection successful:", res.rows);
  }
  pool.end();
});

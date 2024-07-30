import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const mockPosts = [
  {
    title: "First Post",
    content: "This is the first post.",
    secret_password: "password123",
  },
  {
    title: "Second Post",
    content: "This is the second post.",
    secret_password: "secret456",
  },
  {
    title: "Third Post",
    content: "This is the third post.",
    secret_password: "anotherpass",
  },
  {
    title: "Fourth Post",
    content: "This is the fourth post.",
    secret_password: "finalpass",
  },
];

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        secret_password VARCHAR(255)
      )
    `);
    console.log("Table created successfully");
  } catch (err) {
    console.error(err);
  }
};

const insertPosts = async () => {
  try {
    const values = mockPosts.map(
      (post) =>
        `('${post.title}', '${post.content}', '${post.secret_password}')`
    );
    await pool.query(`
      INSERT INTO posts (title, content, secret_password)
      VALUES ${values.join(",")}`);
    console.log("Posts inserted successfully");
  } catch (err) {
    console.error(err);
  }
};

const seedDatabase = async () => {
  await createTable();
  await insertPosts();
  pool.end();
};

seedDatabase();

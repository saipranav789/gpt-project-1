import db from "../data/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    secret,
    { expiresIn: "1h" }
  );
};

const constructorMethod = (app) => {
  // User registration
  app.post("/register", async (req, res) => {
    const { username, password, is_admin } = req.body;
    console.log(username, password, "heree!");
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    try {
      const password_hash = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING *",
        [username, password_hash, is_admin || false]
      );
      const token = generateToken(result.rows[0]);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // User login
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      const user = result.rows[0];
      if (!user) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
      const token = generateToken(user);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Middleware to protect routes
  const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Access denied, token missing!" });
    } else {
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
    }
  };

  // Protected route example
  app.get("/protected", authenticateJWT, async (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });
  // Get all posts
  app.get("/posts", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM posts");
      res.json(result.rows);
    } catch (err) {
      console.log("username", process.env.DB_USERNAME);
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Create a new post
  app.post("/posts", async (req, res) => {
    const { content, user_id } = req.body;
    try {
      const result = await db.query(
        "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
        [content, user_id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Update a post
  app.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
      const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
      const post = result.rows[0];

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const updateQuery =
        "UPDATE posts SET content = $1, updated_at = NOW() WHERE id = $2";
      await db.query(updateQuery, [content, id]);

      res.json({ message: "Post updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Delete a post
  app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
      const post = result.rows[0];

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await db.query("DELETE FROM posts WHERE id = $1", [id]);

      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Get all users
  app.get("/users", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM users");
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Create a new user
  app.post("/users", async (req, res) => {
    const { username, password_hash, is_admin } = req.body;
    try {
      const result = await db.query(
        "INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING *",
        [username, password_hash, is_admin]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Update a user
  app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password_hash, is_admin } = req.body;

    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateQuery = `
        UPDATE users
        SET username = $1,
            password_hash = $2,
            is_admin = $3,
            updated_at = NOW()
        WHERE id = $4
      `;
      await db.query(updateQuery, [username, password_hash, is_admin, id]);

      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Delete a user
  app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await db.query("DELETE FROM users WHERE id = $1", [id]);

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Fallback route
  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Route not found" });
  });
};

export default constructorMethod;

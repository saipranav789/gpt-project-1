import db from "../data/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "3d",
  });
};

const constructorMethod = (app) => {
  // User registration
  app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Check if the email is already in use
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      // Hash the password and insert the new user into the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
      );
      // Generate a token for the new user
      const token = generateToken(result.rows[0]);
      //   res.json({ token });
      res.json({ token, email: email });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  // User login
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const token = generateToken(user);
      res.json({ token, email: user.email });
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

  // Get all posts with user email
  app.get("/posts", async (req, res) => {
    try {
      const result = await db.query(
        "SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id"
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Create a new post
  app.post("/posts", authenticateJWT, async (req, res) => {
    const { content } = req.body;
    console.log("content:", content);
    try {
      const result = await db.query(
        "INSERT INTO posts (content, user_id) VALUES ($1, $2) RETURNING *",
        [content, req.user.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Update a post
  app.put("/posts/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
      const post = result.rows[0];
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.user_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await db.query("UPDATE posts SET content = $1 WHERE id = $2", [
        content,
        id,
      ]);
      res.json({ message: "Post updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  // Delete a post
  app.delete("/posts/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
      const post = result.rows[0];
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.user_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await db.query("DELETE FROM posts WHERE id = $1", [id]);
      res.json({ message: "Post deleted successfully" });
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

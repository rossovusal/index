// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added jsonwebtoken

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Define a simple root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to ROAD TO PS5 API" });
});

// --- AUTH ROUTES ---

// POST /api/auth/register - User Registration
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  // Input Validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store User (Simulated)
    const sqlQuery = "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at";
    const params = [username, hashedPassword];
    
    console.log("Simulated DB Query for User Registration:");
    console.log("SQL:", sqlQuery);
    console.log("Params:", params);

    // Simulate successful database insertion
    // In a real scenario, you would execute the query against the database
    // and handle potential errors like unique username violation.
    // For example:
    // try {
    //   const newUser = await db.query(sqlQuery, params);
    //   // Respond with the created user (excluding password_hash)
    //   res.status(201).json({ 
    //     message: "User registered successfully", 
    //     user: { id: newUser.rows[0].id, username: newUser.rows[0].username, created_at: newUser.rows[0].created_at }
    //   });
    // } catch (dbError) {
    //   if (dbError.code === '23505') { // Unique violation (PostgreSQL specific error code)
    //     return res.status(409).json({ error: "Username already exists" });
    //   }
    //   console.error("Database error during registration:", dbError);
    //   return res.status(500).json({ error: "Internal server error during registration" });
    // }

    res.status(201).json({ message: "User registered successfully (simulated)" });

  } catch (error) {
    console.error("Error during registration process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login - User Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Input Validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Retrieve User (Simulated)
    console.log(`Simulated DB Query for User Login: SELECT * FROM users WHERE username = '${username}'`);
    
    // --- SIMULATION ---
    let user = null;
    // For testing, let's assume 'testuser' exists with password 'password123'
    // The hash for 'password123' (example generated with bcryptjs, salt 10):
    // $2a$10$K8Y.Vq0mXVf9jZ3nQY2X.uI5fJnkQAeLz9uCVqVFc4/4fA2.C0h9G (this will vary if you generate it)
    // For consistency in this example, I'll use a placeholder hash. 
    // IMPORTANT: Replace this with a hash you generate if you run this.
    const simulatedUserPasswordHash = process.env.SIMULATED_USER_HASH || '$2a$10$K8Y.Vq0mXVf9jZ3nQY2X.uI5fJnkQAeLz9uCVqVFc4/4fA2.C0h9G'; // Use a known hash

    if (username === "testuser") { 
      user = {
        id: 1, 
        username: "testuser",
        password_hash: simulatedUserPasswordHash 
      };
    }
    // --- END SIMULATION ---

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // User not found
    }

    // Password Verification
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" }); // Passwords don't match
    }

    // JWT Generation
    const payload = {
      userId: user.id,
      username: user.username,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Use JWT_EXPIRES_IN from .env or default to 1h
    );

    res.status(200).json({
      token,
      userId: user.id,
      username: user.username,
      message: "Login successful (simulated)"
    });

  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get port from environment variables, default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");
require("dotenv").config();

// 1. Rename this to 'db' to match your exports
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const clientPath = path.join(__dirname, "../client/dist");
const SALT_ROUNDS = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(express.static(clientPath));

// 2. Updated API Route to use the db helper function
app.get("/api/categories", async (req, res) => {
  try {
    // Option A: Use the helper function you already wrote (Cleanest)
    const data = await db.getCategories();
    res.json(data);
  } catch (error) {
    // Option B: If you REALLY want to use .from() here, 
    // you would have to type: await db.supabase.from("categories")...
    
    console.error("Database Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const data = await db.getProducts();
    res.json(data);
  } catch (error) {
    console.error("Products Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:category", async (req, res) => {
  try {
    const data = await db.getProductsByCategory(req.params.category);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe secret key is not configured.' });
  }

  const { cart, shipping } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart must include at least one item.' });
  }

  try {
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.category || undefined,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${CLIENT_URL}/store?checkout=success`,
      cancel_url: `${CLIENT_URL}/store?checkout=cancel`,
      metadata: {
        shipping: JSON.stringify(shipping || {}),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: 'Unable to create Stripe checkout session.' });
  }
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await db.createUser(name, email, passwordHash);
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };

    return res.json({ user: safeUser });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ error: 'Failed to login.' });
  }
});

// POST: Save a new order after checkout
app.post("/api/orders", async (req, res) => {
  console.log("Order attempt for user:", req.body.userId);
  try {
    const order = await db.createOrder(req.body);
    console.log("✅ Order created in DB:", order.id);
    res.status(201).json(order);
  } catch (error) {
    // THIS LOG IS THE MOST IMPORTANT PART
    console.error("❌ DATABASE INSERT FAILED:", error.message);
    console.error("DEBUG DETAILS:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all orders for a specific user
app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await db.getOrdersByUserId(req.params.userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ error: "Failed to load order history" });
  }
});

// PATCH: Update status (Useful if you build an admin panel later)
app.patch("/api/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await db.updateOrderStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// REVIEWS
app.get("/api/reviews/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const { data, error } = await db.supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Reviews Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  const {
    product_id,
    product_name,
    user_name,
    rating,
    comment
  } = req.body;

  if (!product_id || !product_name || !user_name || !rating || !comment) {
    return res.status(400).json({
      error: "All fields are required."
    });
  }

  try {
    const { data, error } = await db.supabase
      .from("reviews")
      .insert([
        {
          product_id,
          product_name,
          user_name,
          rating,
          comment
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Create Review Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// SPA Middleware: Keeps React Router working on refresh
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(clientPath, "index.html"));
});


app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});


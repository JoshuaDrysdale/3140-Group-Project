const express = require("express");
const path = require("path");
require("dotenv").config();

// 1. Rename this to 'db' to match your exports
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const clientPath = path.join(__dirname, "../client");

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

app.get("/api/products/:category", async (req, res) => {
  try {
    const data = await db.getProductsByCategory(req.params.category);
    res.json(data);
  } catch (error) {
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
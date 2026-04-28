require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db"); // Import as 'db' to match your function call

app.use(express.json());

// API Endpoint: Keep this, it's perfect!
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.getCategories(); 
        res.json(categories);
    } catch (error) {
        console.error("Database error:", error); // Helpful for debugging
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// REMOVED the static file serving for now to avoid confusion
// We will add the React production build logic here later.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
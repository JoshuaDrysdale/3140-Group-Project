const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const supabase = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;
const clientPath = path.join(__dirname, "../client");

app.use(express.json());
app.use(express.static(clientPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// database endpoint
app.get("/api/categories", async (req, res) => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }

  console.log(`Server running on http://localhost:${PORT}`);
});

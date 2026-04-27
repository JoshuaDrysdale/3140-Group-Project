require("dotenv").config();
const express = require("express");
const path = require("path");
const supabase = require("./db");
const app = express();
app.use(express.json());

app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname, "/public/homepage.html"))
});

//database endpoint
app.get("/api/categories", async (req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error){
    console.error("SUPABASE ERROR:", error);
    return res.status(500).json(error);
  };

  res.json(data);
});

app.use(express.static("public"));
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
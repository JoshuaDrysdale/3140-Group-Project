const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname, "/public/homepage.html"))
});


app.use(express.static("public"));
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
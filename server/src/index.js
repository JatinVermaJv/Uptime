const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});


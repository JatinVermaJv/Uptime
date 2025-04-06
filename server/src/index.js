const express = require("express");
const prisma = require("./db");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ 
      message: "Server is running and database is connected",
      userCount 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      error: "Database connection failed",
      details: error.message 
    });
  }
});
//middleware for the error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Danger",
    details: err.message 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database is connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});


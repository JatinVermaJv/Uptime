const express = require("express");
const cors = require("cors");
const prisma = require("./db");
const authRoutes = require("./routes/auth");
const endpointRoutes = require("./routes/endpoints");
const scheduler = require("./services/scheduler");

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/endpoints', endpointRoutes);

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
    error: "Danger something went wrong",
    details: err.message 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    
    // Start the scheduler
    await scheduler.start();
    console.log("Scheduler started successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  scheduler.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  scheduler.stop();
  await prisma.$disconnect();
  process.exit(0);
});


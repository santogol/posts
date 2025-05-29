const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Carica variabili ambiente
dotenv.config();

// Connessione a MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connesso al DB");
  } catch (err) {
    console.error("❌ Errore nella connessione al DB:", err);
  }
};

startServer();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// API Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);  // ✅ Fixato
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("🚀 Backend server is running on port 8800");
});

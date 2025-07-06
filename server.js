const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/tasks");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Serve the frontend files from "public" folder
app.use(express.static("public"));

// ✅ Handle API routes
app.use("/api/tasks", taskRoutes);

// ✅ Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(5000, () => {
    console.log("✅ Server running at http://localhost:5000");
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});

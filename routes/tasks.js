const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// 🔹 Get all tasks (with optional filters & sorting)
router.get("/", async (req, res) => {
  const { search, category, sortBy } = req.query;

  let filter = {};
  if (search) {
    filter.title = { $regex: search, $options: "i" }; // Case-insensitive
  }
  if (category && category !== "All") {
    filter.category = category;
  }

  let sort = { createdAt: -1 }; // Default: newest first
  if (sortBy === "oldest") sort = { createdAt: 1 };
  if (sortBy === "a-z") sort = { title: 1 };
  if (sortBy === "z-a") sort = { title: -1 };

  const tasks = await Task.find(filter).sort(sort);
  res.json(tasks);
});

// 🔹 Add a new task
router.post("/", async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  const task = new Task({ title, description, dueDate, category });
  await task.save();
  res.json(task);
});

// 🔹 Update task (edit title, status, description, category, due date)
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// 🔹 Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  category: {
    type: String,
    enum: ["Personal", "Work", "Urgent", "Others"],
    default: "Others"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", TaskSchema);

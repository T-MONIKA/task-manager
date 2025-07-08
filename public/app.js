const BASE_URL = "https://task-manager-2jgk.onrender.com/api/tasks";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDesc = document.getElementById("task-desc");
const taskDue = document.getElementById("task-due");
const taskCategory = document.getElementById("task-category");

const taskList = document.getElementById("task-list");
const taskStats = document.getElementById("task-stats");
const taskProgress = document.getElementById("task-progress");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortTasks = document.getElementById("sortTasks");
const darkToggle = document.getElementById("darkModeToggle");

let tasks = [];

// 🌙 Dark Mode
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

// 🔄 Fetch Tasks
async function fetchTasks() {
  const res = await fetch(`${BASE_URL}?search=${searchInput.value}&category=${filterCategory.value}&sortBy=${sortTasks.value}`);
  tasks = await res.json();
  renderTasks();
}

// ➕ Add Task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = {
    title: taskInput.value,
    description: taskDesc.value,
    dueDate: taskDue.value,
    category: taskCategory.value
  };
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  taskInput.value = "";
  taskDesc.value = "";
  taskDue.value = "";
  taskCategory.value = "Others";
  fetchTasks();
});

// 🖼 Render UI
function renderTasks() {
  taskList.innerHTML = "";

  let completed = 0;

  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("done");

    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete('${task._id}', this)">
        <span class="task-title ${task.completed ? "done" : ""}">${task.title}</span>
      </label>
      <div class="task-details">
        ${task.description ? `<p>${task.description}</p>` : ""}
        ${task.dueDate ? `<p>📅 Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ""}
        <p>🗂 ${task.category}</p>
      </div>
      <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑</button>
      <button class="edit-btn" onclick="editTask('${task._id}')">✏️</button>
    `;

    taskList.appendChild(li);
    if (task.completed) completed++;
  });

  taskStats.textContent = `${completed} of ${tasks.length} tasks completed`;
  taskProgress.value = tasks.length ? (completed / tasks.length) * 100 : 0;
}

// ✅ Toggle Complete
async function toggleComplete(id, checkbox) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: checkbox.checked })
  });
  fetchTasks();
}

// 🗑 Delete
async function deleteTask(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

// ✏️ Edit
async function editTask(id) {
  const task = tasks.find(t => t._id === id);
  taskInput.value = task.title;
  taskDesc.value = task.description;
  taskDue.value = task.dueDate ? task.dueDate.split("T")[0] : "";
  taskCategory.value = task.category;
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

// 🔍 Filter/Sort
[searchInput, filterCategory, sortTasks].forEach(input => {
  input.addEventListener("input", fetchTasks);
});

// 🚀 Start
fetchTasks();

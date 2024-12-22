import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("date");

  const API_URL = "https://backend-seven-lyart-50.vercel.app/api/tasks"; // URL ของ Backend

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async (task) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Complete a task
  const completeTask = async (id) => {
    try {
      const task = tasks.find((task) => task._id === id);
      const updatedTask = { ...task, completed: !task.completed };
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const result = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? result : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return filterStatus === "Completed" ? task.completed : !task.completed;
  });

  // Search tasks
  const searchedTasks = filteredTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort tasks
  const sortedTasks = searchedTasks.sort((a, b) => {
    if (sortOption === "date") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortOption === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const task = {
            name: e.target.name.value,
            category: e.target.category.value,
            dueDate: e.target.dueDate.value,
          };
          addTask(task);
          e.target.reset();
        }}
      >
        <input type="text" name="name" placeholder="Task Name" required />
        <input type="text" name="category" placeholder="Category" required />
        <input type="date" name="dueDate" required />
        <button type="submit">Add Task</button>
      </form>
      <div>
        <button onClick={() => setFilterStatus("All")}>All</button>
        <button onClick={() => setFilterStatus("Completed")}>Completed</button>
        <button onClick={() => setFilterStatus("Pending")}>Pending</button>
      </div>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
        <option value="date">Sort by Due Date</option>
        <option value="category">Sort by Category</option>
      </select>
      <ul>
        {sortedTasks.map((task) => (
          <li key={task._id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.name} - {task.category} - {task.dueDate} -{" "}
              <strong>{task.completed ? "Completed" : "Pending"}</strong>
            </span>
            <button onClick={() => completeTask(task._id)}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

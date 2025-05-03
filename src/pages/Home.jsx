// Home page with task management (Add, View, Delete)
import { useEffect, useState } from "react";

const Home = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [task, setTask] = useState(""); // State to handle new task input

  // Fetch tasks on page load
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:8000/api/goals", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  // Add new task
  const addTask = async () => {
    if (task.trim() === "") return;
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ task }),
    });
    setTask("");
    fetchTasks();
  };

  // Delete task by ID
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchTasks();
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task Manager</h2>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add a new task"
        />
        <button
          onClick={addTask}
          className="mt-2 w-full bg-green-500 text-white py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul className="mt-6 max-w-xl mx-auto">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-white p-4 rounded shadow mb-2"
          >
            {task.task}
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

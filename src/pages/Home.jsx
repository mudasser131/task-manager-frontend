// Home page with task management (Add, View, Update, Delete)
import { useEffect, useState } from "react";

const Home = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/goals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addOrUpdateTask = async () => {
    if (task.trim() === "") return;

    const url = editingId
      ? `http://localhost:8000/api/goals/${editingId}`
      : "http://localhost:8000/api/goals";

    const method = editingId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: task }),
      });
      setTask("");
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/goals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setTask(task.text);
    setEditingId(task._id);
  };

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

      {/* Add / Update Task Form */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter a task"
        />
        <button
          onClick={addOrUpdateTask}
          className={`mt-2 w-full ${
            editingId ? "bg-yellow-500" : "bg-green-500"
          } text-white py-2 rounded`}
        >
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      <ul className="mt-6 max-w-xl mx-auto">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-white p-4 rounded shadow mb-2"
          >
            <span>{task.text}</span>
            <div className="space-x-2">
              <button
                onClick={() => startEditing(task)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

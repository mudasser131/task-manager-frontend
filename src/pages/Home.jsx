// Home page with task management (Add, View, Update, Delete)
import { useEffect, useState } from "react";

const Home = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/goals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }
      
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addOrUpdateTask = async (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    const url = editingId
      ? `http://localhost:8000/api/goals/${editingId}`
      : "http://localhost:8000/api/goals";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: task }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to ${editingId ? "update" : "add"} task`);
      }
      
      setTask("");
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/goals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setTask(task.text);
    setEditingId(task._id);
  };

  const cancelEditing = () => {
    setTask("");
    setEditingId(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-60">
      {/* Header with Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add / Update Task Form */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editingId ? "Update Task" : "Create a New Task"}
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                {editingId 
                  ? "Edit your task details below" 
                  : "What do you need to accomplish today?"
                }
              </p>
            </div>
            <form className="mt-5 sm:flex sm:items-center" onSubmit={addOrUpdateTask}>
              <div className="w-full sm:max-w-xs">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your task here"
                />
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0 flex">
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    editingId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    editingId ? "focus:ring-yellow-500" : "focus:ring-blue-500"
                  } transition-colors duration-200`}
                >
                  {editingId ? (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Update Task
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Task
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your list
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-2 text-lg font-medium text-gray-900">{error}</p>
              <button 
                onClick={fetchTasks}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <p className="ml-2 text-sm font-medium text-gray-900">{task.text}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          onClick={() => startEditing(task)}
                          className="mr-3 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 transition-colors duration-150"
                        >
                          <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:bg-red-200 transition-colors duration-150"
                        >
                          <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <p>Created on {new Date(task.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
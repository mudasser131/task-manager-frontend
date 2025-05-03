// App component with routes and authentication management
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useState, useEffect } from "react";

function App() {
  // State to store logged-in user token
  const [user, setUser] = useState(null);

  // Check if user is already logged in using token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  // Handle login and store token
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setUser(token);
  };

  // Handle logout and clear token
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Routes>
      {/* Protected route: Home only accessible when logged in */}
      <Route
        path="/"
        element={user ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      {/* Login route */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      {/* Signup route */}
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

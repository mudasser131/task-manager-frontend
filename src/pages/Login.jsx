// Login page to authenticate users
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  // State to handle login form input
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Update state as user types in the form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {   
      // API request to   login
      const res = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      // If login successful, store token and navigate to Home
      if (res.ok) {
        onLogin(data.token);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mt-4 p-2 border rounded"
        />
        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mt-2 p-2 border rounded"
        />
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white mt-4 py-2 rounded"
        >
          Login
        </button>
        <p className="text-center"> or </p>
        <Link to= '/signup'>
        < h4 className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded">
          Create an Account
        </h4>
      </Link>
      </form>
    </div>
  );
};

export default Login;

// Signup page to register new users
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // State to manage signup form
  const [form, setForm] = useState({
    name: "",    // Added name field
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Update state as user types
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle signup submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API request to register
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (err) {
      alert("Error signing up.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center">Signup</h2>

        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mt-4 p-2 border rounded"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mt-2 p-2 border rounded"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mt-2 p-2 border rounded"
          required
        />

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white mt-4 py-2 rounded hover:bg-green-600"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;

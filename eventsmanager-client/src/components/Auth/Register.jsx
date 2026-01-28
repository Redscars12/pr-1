import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    names: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   try {
      const API_URL = import.meta.env.VITE_API_URL || "https://events-api-cmwi.onrender.com/api";

      await axios.post(`${API_URL}/Auth/register`, form, {
        headers: { "Content-Type": "application/json" },
      });

      setForm({ email: "", password: "", names: "", phone: "" });

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Грешка при регистрация!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Създай акаунт
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Имена
          </label>
          <input
            type="text"
            name="names"
            placeholder="Вашите имена"
            value={form.names}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Телефон
          </label>
          <input
            type="text"
            name="phone"
            placeholder="+359 88 123 4567"
            value={form.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Парола
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-purple-600 transition disabled:opacity-50"
        >
          {loading ? "Регистрация..." : "Регистрация"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Вече имаш акаунт?{" "}
          <a
            href="/login"
            className="text-purple-500 font-semibold hover:underline"
          >
            Вход
          </a>
        </p>
      </form>
    </div>
  );
}

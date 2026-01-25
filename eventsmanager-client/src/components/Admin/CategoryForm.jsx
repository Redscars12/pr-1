import { useState } from "react";
import { createCategory } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CategoryForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory({ name });
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition text-sm font-semibold"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Отказ и връщане
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Нова Категория
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Организирайте събитията по групи
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Име на категорията
            </label>
            <input
              type="text"
              placeholder="напр. Конференции, Спорт..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Обработка...
              </span>
            ) : (
              "Потвърди създаването"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

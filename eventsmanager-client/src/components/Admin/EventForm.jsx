import { useState, useEffect } from "react";
import { createEvent, getCategories } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function EventForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedDate = new Date(form.date).toISOString();

    const eventPayload = {
      Title: form.title,
      Description: form.description || "",
      Date: formattedDate,
      CategoryId: form.categoryId,
      Category: null,
      Participants: [],
    };

    try {
      await createEvent(eventPayload);
      navigate("/");
    } catch (err) {
      console.error("Детайли на грешката:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-gray-500 hover:text-gray-800 transition text-sm font-bold uppercase tracking-widest"
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
          Отказ
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm border border-gray-100 rounded-3xl p-10"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
              Ново Събитие
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              Попълнете данните, за да организирате вашето събитие
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Заглавие
              </label>
              <input
                type="text"
                name="title"
                placeholder="Име на събитието..."
                value={form.title}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Описание
              </label>
              <textarea
                name="description"
                placeholder="Разкажете повече за събитието..."
                value={form.description}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-700 h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Дата
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Категория
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-gray-700 appearance-none"
                  required
                >
                  <option value="">Избери категория</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 tracking-widest text-sm"
            >
              {loading ? "СЪЗДАВАНЕ..." : "ПУБЛИКУВАЙ СЪБИТИЕ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

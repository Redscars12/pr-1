import { useEffect, useState, useContext, useMemo } from "react";
import { getEvents, getCategories } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    Promise.all([getEvents(), getCategories()])
      .then(([eventsRes, catsRes]) => {
        setEvents(eventsRes.data);
        setCategories(catsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    if (selectedCategory !== "all") {
      result = result.filter((e) => e.categoryId === selectedCategory);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [events, selectedCategory, sortOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Зареждане на събития...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Събития</h2>
          <p className="text-gray-500">Намерете следващото си приключение</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 rounded-lg border bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="asc">Най-скорошни (Възходящо)</option>
            <option value="desc">Най-далечни (Низходящо)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-lg border bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="all">Всички категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {user?.role === "Admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/admin/category-form")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                + Нова категория
              </button>

              <button
                onClick={() => navigate("/admin/event-form")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
              >
                + Ново събитие
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="mb-8 border-gray-300" />

      {filteredAndSortedEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <p className="text-gray-400 text-lg">
            Няма събития, отговарящи на тези критерии.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEvents.map((e) => (
            <div
              key={e.id}
              onClick={() => navigate(`/events/${e.id}`)}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer border border-transparent hover:border-blue-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {e.category?.name || "Общи"}
                </span>
                <p className="text-gray-400 text-sm">
                  {new Date(e.date).toLocaleDateString("bg-BG")}
                </p>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                {e.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                {e.description}
              </p>

              <div className="flex items-center text-blue-500 font-semibold text-sm">
                Виж детайли
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

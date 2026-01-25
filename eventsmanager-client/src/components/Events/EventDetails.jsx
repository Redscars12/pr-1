import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getEventById, registerForEvent } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then((res) => {
        setEvent(res.data);
      })
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const isAlreadyRegistered = event?.participants?.some(
    (p) => p.userId === user?.id || p.id === user?.id,
  );

  const handleRegister = async () => {
    if (!id || isAlreadyRegistered) return;
    setRegistering(true);
    try {
      await registerForEvent(id);

      setEvent((prev) => ({
        ...prev,
        participants: [...(prev.participants || []), { userId: user.id }],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Зареждане...</div>;
  if (!event)
    return <div className="text-center mt-10">Събитието не е намерено.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-4">{event.title || event.name}</h2>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <p className="text-sm text-gray-500 mb-6">
        Дата: {new Date(event.date).toLocaleDateString()}
      </p>

      <button
        onClick={handleRegister}
        disabled={registering || isAlreadyRegistered || !user}
        className={`w-full py-3 rounded-xl font-bold transition ${
          isAlreadyRegistered
            ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-300"
            : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        } disabled:opacity-70`}
      >
        {registering
          ? "Записване..."
          : isAlreadyRegistered
            ? "✓ Вече сте записани"
            : "Запиши се"}
      </button>

      {!user && (
        <p className="text-red-500 text-xs mt-2 text-center">
          Трябва да сте логнати, за да се запишете.
        </p>
      )}
    </div>
  );
}

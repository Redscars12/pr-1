import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("Navbar user:", user);

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        EventsApp
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Hi, {user.username}</span>
            {user.role === "Admin" && <Link to="/admin/event-form">Admin</Link>}
            <button
              onClick={handleLogout}
              className="bg-red-600 px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

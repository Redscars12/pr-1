import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import EventList from "./components/Events/EventList";
import EventDetails from "./components/Events/EventDetails";
import EventForm from "./components/Admin/EventForm";
import CategoryForm from "./components/Admin/CategoryForm";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/event-form"
            element={
              <AdminRoute>
                <EventForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/category-form"
            element={
              <AdminRoute>
                <CategoryForm />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

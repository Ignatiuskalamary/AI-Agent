import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const AppContext = createContext();
// In your context provider file
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  // Set axios auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        // Auto-logout if token is invalid
        setToken(null);
      }
    }
  };

  // Initial setup
  useEffect(() => {
    fetchBlogs();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (data.success) {
        setToken(data.token);
        navigate("/admin"); // Redirect to admin dashboard after login
        toast.success("Login successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // const logout = () => {
  //   setToken(null);
  //   navigate("/login");
  //   toast.success("Logged out successfully");
  // };

  const logout = () => {
    setToken(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    login,
    logout,
    fetchBlogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;

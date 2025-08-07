import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  //const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  // Set axios auth header whenever token changes

  useEffect(() => {
    console.log(
      "Token changed:",
      import.meta.env.VITE_BASE_URL || "http://localhost:3000/api"
    );
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/blog/all");
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Fetch error:", error);
        if (error.response?.status === 401) {
          console.log("Unauthorized - clearing token");
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    };

    fetchData();
  }, [token]);
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        // Auto-logout if token is invalid
        setToken(null);
        navigate("/login");
      }
    }
  };
  // Initial setup
  useEffect(() => {
    fetchBlogs();
  }, []);
  // const fetchBlogs = async () => {
  //   try {
  //     const { data } = await axios.get("/api/blog/all");
  //     data.success ? setBlogs(data.blogs) : toast.error(data.message);
  //     console.log("Fetching blogs...");
  //   } catch (error) {
  //     toast.error(error.message);
  //     console.error("Error fetching blogs:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchBlogs();
  //   const token = localStorage.getItem("token");
  //   console.log("Token from localStorage:", token);
  //   if (token) {
  //     setToken(token);
  //     axios.defaults.headers.common["Authorization"] = `${token}`;
  //   }
  //   console.log(
  //     "Token state:",
  //     (axios.defaults.headers.common["Authorization"] = ` ${token}`)
  //   );
  // }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
  };
  return (
    <AppContext.Provider value={{ value }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;

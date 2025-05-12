import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Token'ı localStorage'dan al
      const userId = localStorage.getItem("userId");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Authorization header ile kullanıcı bilgilerini al
        const res = await api.get("/customers/" + userId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login işlemi
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });
      const { token, userId } = response.data; // Token'ı al

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Kullanıcı bilgilerini al
      const userResponse = await api.get("/customers/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(userResponse.data);
      // Kullanıcı bilgisini kaydet
      setUser(userResponse.data);
    } catch (err) {
      console.error("Login failed", err);
      throw new Error("Giriş başarısız.");
    }
  };

  // Logout işlemi
  const logout = async () => {
    try {
      localStorage.removeItem("token"); // Token'ı kaldır
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

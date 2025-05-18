import {createContext, useContext, useState, useEffect} from "react";
import api from "../services/api";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8090';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        try {
            const res = await api.get(`/customers/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data);
        } catch (err) {
            console.error("Cannot refresh user context user", err);
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
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

    // Login islemi
    const login = async (username, password) => {
        try {
            const response = await axios.post(API_BASE_URL + "/auth/login", {
                username,
                password,
            });
            const {token, userId} = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

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
            throw new Error("Login Failed.");
        }
    };

    // Logout işlemi
    const logout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{user, setUser, login, logout, refreshUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import {
  loginUser,
  verifyUser as verifyUserService,
  resendCode as resendCodeService,
} from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hydrating, setHydrating] = useState(true); // ⭐ NEW: restoring session
  const [loading, setLoading] = useState(false); // ⭐ Only for UI actions
  const [error, setError] = useState(null);

  // ⭐ Load user from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setHydrating(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched user on refresh:", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth error:", error.message);
        localStorage.removeItem("token");
      } finally {
        setHydrating(false); // 🔥 Do NOT mark false until user is restored
      }
    };

    fetchUser();
  }, []);

  // 🔐 Login user
  const login = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginUser(formData);
      localStorage.setItem("token", token);
      setUser(user);
      return { user };
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 📌 Verification
  const verifyUser = async (identifier, code) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await verifyUserService(identifier, code);
      localStorage.setItem("token", token);
      setUser(user);
    } catch (err) {
      setError(err.message || "Verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📤 Resend code
  const resendCode = async (identifier, method = "email") => {
    setLoading(true);
    setError(null);
    try {
      const res = await resendCodeService(identifier, method);
      return res.message;
    } catch (err) {
      setError(err.message || "Failed to resend code");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        verifyUser,
        resendCode,
        loading,
        hydrating, // ⭐ Pass hydrating to ProtectedRoute
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

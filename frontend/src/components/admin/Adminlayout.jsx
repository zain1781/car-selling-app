import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Adminnav from "./Adminnav";
import Login from "../auth/login";

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        jwtDecode(token); // Just checking if token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid Token:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  return isAuthenticated ? <Adminnav /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
}

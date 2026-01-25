import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveAuth = (accessToken, refreshToken) => {
    if (!accessToken || accessToken === "undefined") {
      setUser(null);
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken || "");
    
    try {
      const decoded = jwtDecode(accessToken);
      
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.sub;

      const userData = {
        token: accessToken,
        role: role, 
        username: username
      };

      setUser(userData); 
      return { success: true };
    } catch (error) {
      console.error("JWT Decode error:", error);
      setUser({ token: accessToken });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && token !== "undefined") {
      saveAuth(token, localStorage.getItem("refreshToken"));
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    const access = data.accessToken || data.AccessToken;
    const refresh = data.refreshToken || data.RefreshToken;
    return saveAuth(access, refresh); 
  };

  const logout = () => {
    localStorage.clear();
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

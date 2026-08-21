import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser, setToken, removeToken, getMe, login as apiLogin } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('batipme_token');
    if (token) {
      getMe()
        .then(u => { setUserState(u); setUser(u); })
        .catch(() => { removeToken(); setUserState(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, motDePasse) => {
    const res = await apiLogin(email, motDePasse);
    setToken(res.access_token);
    setUser(res.utilisateur);
    setUserState(res.utilisateur);
    return res;
  };

  const logout = () => {
    removeToken();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser: setUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

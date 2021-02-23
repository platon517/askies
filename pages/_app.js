import '../styles/globals.css'
import { createContext, useState, useEffect } from 'react';
import MainContainer from "../components/MainContainer/MainContainer";

export const AuthContext = createContext(null);

const MyApp = ({ Component, pageProps }) => {

  const [auth, setAuth] = useState({});

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    } else {
      setAuth(null)
    }
  }, [])

  const setAuthHandler = auth => {
    setAuth(auth);
    localStorage.setItem('auth', JSON.stringify(auth));
  };

  const logoutHandler = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthHandler, logoutHandler }}>
      <MainContainer>
        <Component {...pageProps} />
      </MainContainer>
    </AuthContext.Provider>
  );
}

export default MyApp

//{ id: 1, nickname: '@ilya_platonov' }

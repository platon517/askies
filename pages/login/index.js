import styles from './Login.module.scss';
import {useState, useRef, useContext, useEffect} from 'react';
import {apiUrl} from "../index";
import {AuthContext} from "../_app";
import { useRouter } from "next/router";

const Login = () => {

  const { auth, setAuthHandler } = useContext(AuthContext);

  const router = useRouter();

  useEffect(async () => {
    if (auth) {
      const redirect = router.query.redirect;
      await router.push(redirect ? redirect : '/');
    }
  }, [auth])

  const login = useRef();
  const password = useRef();

  const [ errors, setErrors ] = useState({});

  const loginHandler = async type => {
    const response = await fetch(`${apiUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          login: login.current.value,
          password: password.current.value,
        }
      )
    });
    const data = await response.json();
    if (response.ok) {
      setAuthHandler(data);
    } else {
      setErrors(data.errors)
    }
  };

  return(
    <div className={styles.container}>
      <input ref={login} placeholder={'Login'} type={'text'}/>
      <div className={styles.error} style={{ opacity: errors.login ? 1 : 0 }}>{errors.login || 'error'}</div>
      <input ref={password} placeholder={'Password'} type={'password'}/>
      <div className={styles.error} style={{ opacity: errors.password ? 1 : 0 }}>{errors.password || 'error'}</div>
      <div style={{ marginTop: '0.5rem' }}>
        <button onClick={() => loginHandler('login')}>Sign in</button>
        <button
          onClick={() => loginHandler('users')}
          style={{ marginLeft: '1rem', backgroundColor: 'black', color: 'white' }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;

import styles from './MainContainer.module.scss';
import {useCallback, useContext} from 'react';
import { useRouter } from "next/router";
import {AuthContext} from "../../pages/_app";

const MainContainer = ({ children }) => {

  const { auth, logoutHandler } = useContext(AuthContext);

  const router = useRouter();

  const toMain = useCallback(async () => {
    await router.push('/')
  }, [])

  const loginHandler = async () => {
    router.asPath !== '/login' &&
    await router.push({
      pathname: '/login',
      query: {
        redirect: router.asPath
      }
    })
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 onClick={toMain} className={styles.title}>
          Askies
        </h1>
        <span>
          {
            auth &&
            <span>
              {
                auth.login
              }
              {
                ' | '
              }
            </span>
          }
          <span onClick={auth ? logoutHandler : loginHandler} className={styles.logout}>
            {
              auth ?
                'Log out'
                :
                'Log in'
            }
          </span>
        </span>
      </div>
      {
        children
      }
    </div>
  );
};

export default MainContainer;

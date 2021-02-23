import Head from 'next/head'
import { useContext, useEffect } from 'react';
import CreateAskie from "../components/CreateAskie/CreateAskie";
import {AuthContext} from "./_app";
import styles from "./Pages.module.scss";
import { useRouter } from "next/router";

export const apiUrl = process.env.NODE_ENV !== 'production' ? 'http://192.168.0.16:8000' : ''


export default function Main() {

  const router = useRouter();

  const { auth } = useContext(AuthContext);

  const loginHandler = async () => {
    await router.push({
      pathname: '/login',
      query: { redirect: `/` }
    });
  }

  return (
    <div>
      <Head>
        <title>Askies</title>
      </Head>
      {
        auth ?
          <CreateAskie/>
          :
          <div className={styles.anonText}>
            <span className={styles.lock}>🔒</span>
            <span onClick={loginHandler} className={styles.login}>Login</span> to create a poll.
          </div>
      }
    </div>
  )
}

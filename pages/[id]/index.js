import styles from './Askie.module.scss';
import Radios from "../../components/Radios/Radios";
import Comments from "../../components/Comments/Comments";
import { useState, useCallback, useEffect } from 'react';
import Head from "next/head";
import {apiUrl} from "../index";
import { useRouter } from "next/router";

let timer = null;

const Askie = ({ askieProp }) => {

  const router = useRouter();

  const [askie, setAskie] = useState(askieProp);

  const updateAskie = async (stop = false) => {
    if (stop) {
      clearTimeout(timer);
      timer = null;
      return;
    }
    const response = await fetch(`${apiUrl}/askies/${router.query.id}`);
    const askie = await response.json();
    setAskie(askie);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(updateAskie, 3000);
  }

  useEffect( () => {
    updateAskie()
    return () => updateAskie(true)
  }, []);

  return (
    <>
      <Head>
        <title>Askies | { askie?.question }</title>
      </Head>
      <div>
        <div className={styles.title}>
        <span className={styles.author}>
          @
          {
            askie?.author?.login
          }
        </span> asks:
          <div className={styles.question}>
            { askie?.question }
          </div>
        </div>
        <Radios updateAskie={updateAskie} options={askie?.options || []} />
        {
          askie?.enableComments &&
          <Comments comments={askie?.comments || []} updateAskie={updateAskie}/>
        }
      </div>
    </>
  );
};

export async function getServerSideProps({query: { id }}) {

  const response = await fetch(`${apiUrl}/askies/${id}`);
  const askie = await response.json();

  return {
    props: {
      askieProp: askie,
    },
  }
}

export default Askie;

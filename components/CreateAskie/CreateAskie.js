import styles from './CreateAskie.module.scss';
import TextareaAutosize from "react-textarea-autosize";
import { useState, useCallback, useRef, useContext } from 'react';
import update from 'immutability-helper';
import {AuthContext} from "../../pages/_app";
import { useRouter } from "next/router";
import {apiUrl} from "../../pages";

const CreateAskie = () => {

  const { auth } = useContext(AuthContext);

  const router = useRouter();

  const questionRef = useRef();

  const [enableComments, setEnableComments] = useState(true);

  const [options, setOptions] = useState([
    {
      id: 0,
      value: 'Doggies'
    },
    {
      id: 1,
      value: 'Kitty Cats'
    },
  ]);

  const addOption = useCallback(() => {
    const newOption = {
      id: Math.random(),
      value: 'Another option'
    };
    setOptions(prevState => [...prevState, newOption])
  }, [])

  const editOption = (id, value) => {
    const newOptions = update(options, {
      [options.findIndex(option => option.id === id)]: {
        $set: {
          id,
          value
        }
      }
    });
    setOptions(newOptions);
  };

  const deleteOption = id => {
    const newOptions = options.filter(option => option.id !== id);
    setOptions(newOptions);
  };

  const ask = async () => {
    const response = await fetch(`${apiUrl}/askies`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          question: questionRef.current.value,
          options,
          enableComments,
          author: '6033ea4c92d86976da944180' //auth.id
        }
      )
    });
    const data = await response.json();
    await router.push(`/${data._id}`);
  };

  return (
    <div>
      <TextareaAutosize ref={questionRef} maxLength={1000} placeholder={'Who is better?'} className={styles.textArea}/>
      <div style={{ marginTop: '1rem' }}>
        {
          options.map(
            (option, index) =>
              <label key={option.id} className={styles.radios}>
                <input disabled type={'radio'}/>
                <input
                  onChange={e => editOption(option.id, e.target.value)}
                  placeholder={option.value || 'Option'}
                  type={'text'}
                  className={styles.optionInput}
                />
                {
                  index > 1 &&
                  <button onClick={() => deleteOption(option.id)} className={styles.deleteOption}>delete</button>
                }
              </label>
          )
        }
      </div>
      <div className={styles.buttons}>
        <button onClick={addOption} className={styles.addOption}>+ Add option</button>
        <div>
          <label className={styles.commentsCheckbox}>
            <input checked={enableComments} onChange={e => setEnableComments(e.target.checked)} type={'checkbox'}/>
            <span>Enable comments</span>
          </label>
          <button onClick={ask} className={styles.askButton}>Ask</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAskie;

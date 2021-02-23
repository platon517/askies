import styles from './Comments.module.scss';
import { useRef, useEffect, useState, useCallback, useContext } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {AuthContext} from "../../pages/_app";
import {useRouter} from "next/router";
import {apiUrl} from "../../pages";
import moment from 'moment';

const Comments = ({comments, updateAskie}) => {

  const router = useRouter();

  const { auth } = useContext(AuthContext);

  const [replyTo, setReplyTo] = useState(null);

  const textArea = useRef();
  const buttonSend = useRef();

  useEffect(() => {
    if (auth) {
      buttonSend.current.style.height = textArea.current.style.height;
    }
  }, [textArea, auth])

  const postComment = async () => {
    const newComment = {
      text: textArea.current.value,
      replyTo
    };
    textArea.current.value = '';

    try {
      await fetch(`${apiUrl}/askies/${router.query.id}/comment`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': auth.token
        },
        body: JSON.stringify(newComment)
      });
      updateAskie();
    } catch (e) {

    }

    setReplyTo(null);
  };

  const enterHandler = useCallback(e => {
    if(e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      postComment();
    }
  }, [replyTo])

  const loginHandler = async () => {
    await router.push({
      pathname: '/login',
      query: { redirect: `/${router.query.id}` }
    });
  }

  return(
    <div>
      <div className={styles.title} >🤔 💬 Comments:</div>
      {
        comments.map(
          comment =>
            <div key={comment.id} style={{ marginTop: '1rem'}}>
              {
                comment.replyTo &&
                <div style={{ fontWeight: '200', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  ↪ reply to <span style={{ fontWeight: '400' }}>
                  @{comments.find(c => c._id === comment.replyTo)?.author.login}
                </span>
                </div>
              }
              <div style={{ fontWeight: '200', wordBreak: 'break-word' }}>{comment.text}</div>
              <div style={{ fontWeight: '400', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                @{comment.author.login}
                <span style={{ fontWeight: '200', marginLeft: '0.25rem' }}>
                  {
                    moment(comment.date).format('DD MMM YYYY, HH:mm')
                  }
                </span>
                <span onClick={() => {
                  setReplyTo(comment._id);
                  textArea.current.focus();
                }} className={styles.reply} >Reply</span>
              </div>
            </div>
        )
      }
      {
        auth ?
          <div style={{ marginTop: '1rem' }}>
            {
              replyTo &&
              <div style={{ fontWeight: '200', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                ↪ reply to <span style={{ fontWeight: '400' }}>
                  @{comments.find(comment => comment._id === replyTo)?.author.login}
                </span>
                <span onClick={() => setReplyTo(null)} className={styles.cancelReply}>cancel</span>
              </div>
            }
            <div className={styles.commentInputContainer}>
              <TextareaAutosize
                ref={textArea}
                maxLength={300}
                placeholder={'What do you think?'}
                rows={1}
                className={styles.commentInput}
                onKeyPress={enterHandler}
              />
              {/*<textarea placeholder={'What do you think?'} rows={1} className={styles.commentInput}/>*/}
              <button onClick={postComment} ref={buttonSend}>Send</button>
            </div>
          </div>
          :
          <div className={styles.anonText}>
            <span className={styles.lock}>🔒</span>
            <span onClick={loginHandler} className={styles.login}>Login</span> to poll and comment.
          </div>
      }
    </div>
  );
};

export default Comments;

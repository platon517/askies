import styles from './Radios.module.scss';
import {useState, useCallback, useMemo, useContext} from "react";
import {AuthContext} from "../../pages/_app";
import {apiUrl} from "../../pages";
import { useRouter } from "next/router";

const Radios = ({ options, updateAskie }) => {

  const router = useRouter();

  const { auth } = useContext(AuthContext);

  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [viewResultsMode, setViewResultsMode] = useState(false);

  const selectOption = useCallback(async (optionId) => {
    setIsResultsLoading(true);
    await fetch(`${apiUrl}/askies/${router.query.id}/vote/${optionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': auth.token
      },
    });
    updateAskie();
  }, [auth]);

  const modifiedOptions = useMemo(() => {
    const maxValue = Math.max(...options.map(option => option.voters.length));
    const sumValues = options.reduce((sum, option) => sum += option.voters.length, 0);
    return options.map(option => ({
      ...option,
      percents: option.voters.length / (sumValues / 100),
      percentsWidth: maxValue > 0 ? option.voters.length / (maxValue / 100) : 0
    }));
  }, [options]);

  const viewResultsModeHandler = useCallback(
    () => setViewResultsMode(prevState => !prevState), []
  );

  const selectedValueExists = useMemo(() => {
    return options.some(option => option.voters.find(voter => voter === auth?._id))
  }, [options, viewResultsMode, auth]);

  const resultView = !auth || viewResultsMode || selectedValueExists;

  return (
    <>
      <form className={styles.form_radio}>
        {
          modifiedOptions.map(
            option =>
              <label htmlFor={option._id} className={styles.radios} key={option._id} style={{
                color: (resultView || isResultsLoading) ? 'black' : '',
                cursor: (resultView || isResultsLoading) ? 'default' : 'pointer',
                fontWeight: resultView && option.selected ? '400' : '200'
              }}>
                <div>
                  <input
                    style={{
                      opacity: resultView ? 0 : 1,
                      width: resultView ? '0' : 'auto'
                    }}
                    onChange={() => selectOption(option._id)}
                    id={option._id}
                    type="radio"
                    name={'radios'}
                    value={option._id}
                    disabled={resultView || isResultsLoading}
                  />
                  <span style={{
                    width: resultView ? 'auto' : '0'
                  }} className={styles.percents}>{(option.percents || 0).toFixed(0)}%</span>
                  {
                    resultView &&
                    <span style={{ marginLeft: '0.5rem' }}>({option.voters.length})</span>
                  }
                  <span className={styles.name}>
                    {
                      option.value
                    }
                  </span>
                  {
                    option.selected && <span className={styles.checkMark}>✓</span>
                  }
                </div>
                <div style={{
                  opacity: resultView ? 1 : 0,
                  width: resultView ? `${option.percentsWidth}%` : '0'
                }} className={styles.progress}/>
              </label>
          )
        }
      </form>
      {
        !selectedValueExists && auth &&
        <div onClick={viewResultsModeHandler} className={styles.viewResults}>
          {
            viewResultsMode ?
              'Back to voting'
              :
              'View results'
          }
        </div>
      }
    </>
  );
};

export default Radios;

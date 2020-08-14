import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import './App.scss';

const Stopwatch = (props) => {
  const [timer, setTimer] = useState('');
  const [alert, setAlert] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const timerMinutes = Math.floor(timer / 60);
  let timerSeconds = timer % 60;
  timerSeconds = timerSeconds < 10 ? '0' + timerSeconds : timerSeconds;

  const alertMsg = useAlert();

  const playAudio = () => {
    document.getElementById('audio').play();
  };

  useEffect(() => {
    if (isRunning) {
      const id = window.setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      const id = window.setInterval(() => {
        setAlert((alert) => alert - 1);
      }, 1000);
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [isRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsRunning(false);
    }
  }, [timer]);

  useEffect(() => {
    if (alert === 0) {
      setAlert(props.alert);
      alertMsg.show('Change Position');
      playAudio();
    }
  }, [alert, props.alert, alertMsg]);

  useEffect(() => {
    setTimer(props.timer * 60);
  }, [props.timer]);

  useEffect(() => {
    setAlert(props.alert);
  }, [props.alert]);

  return (
    <div className="app">
      <div className={`time-circle ${isRunning ? '' : 'paused'}`}>
        <div className="time">
          {timerMinutes}:{timerSeconds}
          <p className="time paragraph">{alert}</p>
        </div>
      </div>
      <div className={`buttons ${timer === 0 ? 'disabled' : '0'}`}>
        {!isRunning ? (
          <button
            className="play-pause"
            onClick={() => setIsRunning(true)}
            disabled={timer === 0}
          >
            <i className="fa fa-play fa-2x" />
          </button>
        ) : (
          <button className="play-pause" onClick={() => setIsRunning(false)}>
            <i className="fa fa-pause fa-2x" />
          </button>
        )}

        <button
          className="reset"
          onClick={() => {
            setIsRunning(false);
            setTimer(props.timer * 60);
            setAlert(props.alert);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;

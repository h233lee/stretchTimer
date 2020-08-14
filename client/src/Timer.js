import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import Axios from 'axios';
import DiscreteSlider from './Slider';
import Stopwatch from './Stopwatch';
import Grid from '@material-ui/core/Grid';

const Timer = (props) => {
  const [local, setLocal] = useState({
    id: '',
    timer: '',
    alarm: '',
    isgoogleId: false,
    loggedIn: false,
  });

  const setTimer = (v) => setLocal({ ...local, timer: v.toString() });
  const setAlert = (v) => setLocal({ ...local, alert: v.toString() });

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const history = useHistory();

  useEffect(() => {
    if (props.history.location.state !== undefined) {
      const {
        id,
        timer,
        alert,
        isgoogleId,
        loggedIn,
      } = props.history.location.state;

      setLocal({
        id,
        timer,
        alert,
        isgoogleId,
        loggedIn,
      });
    }
  }, [props.history.location.state]);

  const logout = () => {
    Axios({
      method: 'GET',
      url: 'http://localhost:5000/logout',
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      history.push('/');
    });
  };

  const register = () => {
    Axios({
      method: 'POST',
      data: {
        email: registerEmail,
        password: registerPassword,
        timer: local.timer,
        alert: local.alert,
      },
      withCredentials: true,
      url: 'http://localhost:5000/register',
    }).then((res) => {
      history.push({
        pathname: '/',
      });
    });
  };

  const updateInfo = () => {
    Axios({
      method: 'PUT',
      data: {
        email: local.id,
        timer: local.timer,
        alert: local.alert,
      },
      withCredentials: true,
      url: 'http://localhost:5000/update',
    }).then((res) => {
      setLocal({ ...local, timer: res.data.timer, alert: res.data.alert });
    });
  };

  return (
    <div>
      {local.timer && local.alert && (
        <div>
          <Stopwatch timer={local.timer} alert={local.alert} />
          <Grid align="center">
            <DiscreteSlider
              onChange={setTimer}
              time={local.timer}
              name={'Timer: In Minutes'}
            />
            <DiscreteSlider
              onChange={setAlert}
              time={local.alert}
              name={'Alert: In Seconds'}
            />
          </Grid>
        </div>
      )}
      {local.isgoogleId ? (
        <div>
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
          ></GoogleLogout>
          <button onClick={updateInfo}>Update Timer and Alert</button>
        </div>
      ) : local.id ? (
        <div>
          <Link to="/">
            <button onClick={logout}>Log Out</button>
          </Link>
          <button onClick={updateInfo}>Update Timer and Alert</button>
        </div>
      ) : (
        <div>
          <div>
            <h1>Register</h1>
            <input
              placeholder="email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              placeholder="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={register}>Submit</button>
            <Link to="/">back</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

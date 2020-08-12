import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import Axios from 'axios';
import DiscreteSlider from './Slider';

const Timer = (props) => {
  const [local, setLocal] = useState({
    id: '',
    timer: 0,
    alarm: 0,
    googleId: false,
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
        googleId,
        loggedIn,
      } = props.history.location.state;

      setLocal({
        id,
        timer,
        alert,
        googleId,
        loggedIn,
      });
    }
  }, []);

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
      },
      withCredentials: true,
      url: 'http://localhost:5000/register',
    }).then((res) => {
      history.push({
        pathname: '/',
      });
    });
  };

  return (
    <div>
      <h1>timer app</h1>

      {local.googleId ? (
        <GoogleLogout
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={logout}
        ></GoogleLogout>
      ) : local.id ? (
        <Link to="/">
          <button onClick={logout}>Log Out</button>
        </Link>
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
          </div>

          <Link to="/">back</Link>
        </div>
      )}

      <h1>timer:{local.timer}</h1>
      <h1>alert:{local.alert}</h1>

      {local.timer && (
        <DiscreteSlider onChange={setTimer} time={local.timer} name={'timer'} />
      )}

      {local.alert ? (
        <DiscreteSlider onChange={setAlert} time={local.alert} name={'alert'} />
      ) : (
        local.timer
      )}
    </div>
  );
};

export default Timer;

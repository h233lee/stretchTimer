import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { useHistory, Link } from 'react-router-dom';

export const Login = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [local, setLocal] = useState({
    id: '',
    timer: '',
    alert: '',
    googleId: false,
    loggedIn: false,
  });

  const history = useHistory();

  const register = () => {
    Axios({
      method: 'POST',
      data: {
        email: registerEmail,
        password: registerPassword,
        timer: '0',
        alert: '0',
      },
      withCredentials: true,
      url: 'http://localhost:5000/register',
    }).then((res) => {
      history.push({
        pathname: '/timer',
        state: {
          id: res.data.email,
          timer: res.data.timer,
          alert: res.data.alert,
          googleId: false,
          loggedIn: true,
        },
      });
    });
  };

  const login = () => {
    Axios({
      method: 'POST',
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: 'http://localhost:5000/login',
    }).then((res) => {
      setLocal({
        id: res.data.email,
        timer: res.data.timer,
        alert: res.data.alert,
        googleId: false,
      });
      history.push({
        pathname: '/timer',
        state: {
          id: res.data.email,
          timer: res.data.timer,
          alert: res.data.alert,
          googleId: false,
          loggedIn: true,
        },
      });
    });
  };

  const noLogin = () => {
    history.push({
      pathname: '/timer',
      state: {
        id: '',
        timer: '0',
        alert: '0',
        googleId: false,
        loggedIn: false,
      },
    });
  };

  const responseGoogle = (response) => {
    if (response === 'code') {
    } else {
      Axios({
        method: 'POST',
        url: 'http://localhost:5000/login/google',
        data: {
          email: response.profileObj.email,
          googleId: response.googleId,
          password: response.googleId,
        },
        withCredentials: true,
      }).then((res) => {
        history.push({
          pathname: '/timer',
          state: {
            id: res.data.googleId,
            timer: res.data.timer,
            alert: res.data.alert,
            googleId: true,
            loggedIn: true,
          },
        });
      });
    }
  };

  useEffect(() => {
    Axios({
      method: 'GET',
      url: 'http://localhost:5000/user',
      withCredentials: true,
    }).then((res) => {
      setLocal({
        id: res.data.email,
        alert: res.data.alert,
        timer: res.data.timer,
      });
    });
  }, []);

  return (
    <div className="App">
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

      <div>
        <h1>Login</h1>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        <button onClick={login}>Submit</button>
      </div>

      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login"
        isSignedIn={true}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        SameSite="None"
      />

      <p>
        or proceed without logging in <button onClick={noLogin}>here</button>
      </p>
    </div>
  );
};

export default Login;

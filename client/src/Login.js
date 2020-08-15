import React, { useState, useEffect } from 'react';
import './App.scss';
import Axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';

export const Login = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [toggleSignIn, setToggleSignIn] = useState(false);

  const [local, setLocal] = useState({
    id: '',
    timer: '1',
    alert: '1',
    isgoogleId: false,
    loggedIn: false,
  });

  const history = useHistory();

  const register = () => {
    Axios({
      method: 'POST',
      data: {
        email: registerEmail,
        password: registerPassword,
        timer: '1',
        alert: '1',
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
          isgoogleId: false,
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
          isgoogleId: local.isgoogleId,
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
        timer: '1',
        alert: '1',
        isgoogleId: false,
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
            id: res.data.email,
            timer: res.data.timer,
            alert: res.data.alert,
            isgoogleId: true,
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
    <div className="Login">
      <div
        className={`container ${toggleSignIn && 'right-panel-active'}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                isSignedIn={true}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                SameSite="None"
              />
            </div>
            <span>or use your email for registration</span>
            <input
              type="email"
              placeholder="email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={register}>Sign Up</button>
            <p>
              or proceed without logging in{' '}
              <a to="/timer" onClick={noLogin}>
                here
              </a>
            </p>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                isSignedIn={true}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                SameSite="None"
              />
            </div>
            <span>or use your account</span>
            <input
              placeholder="email"
              type="email"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={login}>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To start stretching with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={(e) => setToggleSignIn(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start stetching!</p>
              <button className="ghost" onClick={(e) => setToggleSignIn(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

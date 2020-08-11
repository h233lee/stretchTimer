import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import Axios from 'axios';

const Timer = (props) => {
  const [local, setLocal] = useState({
    id: '',
    timer: '',
    alarm: '',
    googleId: false,
    loggedIn: false,
  });

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

  return (
    <div>
      <h1>timer app</h1>

      {local.googleId ? (
        <GoogleLogout
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={logout}
        ></GoogleLogout>
      ) : (
        <Link to="/">
          <button onClick={logout}>Log Out</button>
        </Link>
      )}
    </div>
  );
};

export default Timer;

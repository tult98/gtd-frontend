import React, { useState, useEffect } from 'react';
import AuthUserContext from './context';
import AccountServices from '../../services/AccountService';
import { LOCAL_STORAGE } from '../../utils/Constant';

const withAuthentication = (Component) => {
  const WithAuthentication = (props) => {
    const [authUser, setAuthUser] = useState(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_INFO))
    );
    const [error, setError] = useState();

    useEffect(() => {
      if (
        localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) ||
        localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)
      ) {
        AccountServices.currentUser()
          .then((res) => {
            setAuthUser(res);
            localStorage.setItem(LOCAL_STORAGE.USER_INFO, JSON.stringify(res));
          })
          .catch((e) => {
            setError(e);
          });
      }
    }, []);

    return (
      <AuthUserContext.Provider value={{ authUser: [authUser, setAuthUser] }}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };
  return WithAuthentication;
};

export default withAuthentication;

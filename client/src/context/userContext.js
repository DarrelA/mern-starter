import React, { useContext, useReducer } from 'react';

const UserContext = React.createContext({
  _id: '',
  name: '',
  message: '',
  login: () => {},
  register: () => {},
});

const { _id, name, token, isAdmin } = {
  ...JSON.parse(localStorage.getItem('userData')),
};

const initialState = {
  _id: _id || '',
  name: name || '',
  token: token || '',
  isAdmin: isAdmin || false,
  message: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER_SUCCESS': {
      const { _id, name, isAdmin, token } = action.payload;
      return { ...state, _id, name, isAdmin, token, message: '' };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, message: action.payload.message };
    }

    case 'REGISTER_USER_SUCCESS': {
      const { _id, name, isAdmin, token } = action.payload;
      return { ...state, _id, name, isAdmin, token, message: '' };
    }

    case 'REGISTER_USER_FAIL': {
      return { ...state, message: action.payload.message };
    }

    default:
      return initialState;
  }
};

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const addUserToLocalStorage = (_id, name, isAdmin, token) => {
    localStorage.setItem(
      'userData',
      JSON.stringify({ _id, name, isAdmin, token })
    );
  };

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const { _id, name, isAdmin, token } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { _id, name, isAdmin, token },
      });

      addUserToLocalStorage(_id, name, isAdmin, token);
    } catch (error) {
      dispatch({ type: 'LOGIN_USER_FAIL', payload: error });
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await fetch(`/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      const { _id, isAdmin, token } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: { _id, name, isAdmin, token },
      });

      addUserToLocalStorage(_id, name, isAdmin, token);
    } catch (error) {
      dispatch({ type: 'REGISTER_USER_FAIL', payload: error });
    }
  };

  return (
    <UserContext.Provider value={{ ...userState, login, register }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };

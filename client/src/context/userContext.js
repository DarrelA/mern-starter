import React, { useContext, useReducer } from 'react';

const UserContext = React.createContext({ _id: '', message: '' });
const { _id, name, token, isAdmin } = {
  ...JSON.parse(localStorage.getItem('userData')),
};

const initialState = {
  _id: _id || '',
  name: name || '',
  token: token,
  isAdmin: isAdmin || false,
  message: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_STATE': {
      return { ...state, message: '' };
    }

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

    case 'LOGOUT_USER_SUCCESS': {
      return { _id: '', name: '', token: '', message: '' };
    }

    case 'UPDATE_USER_SUCCESS': {
      const { _id, name, isAdmin, message } = action.payload;
      return { ...state, _id, name, isAdmin, message };
    }

    case 'UPDATE_USER_FAIL': {
      return { ...state, message: action.payload.message };
    }

    default:
      return initialState;
  }
};

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const clearAlert = () =>
    setTimeout(() => dispatch({ type: 'CLEAR_STATE' }, 1000));

  const addUserToLocalStorage = (_id, name, isAdmin, token) => {
    localStorage.setItem(
      'userData',
      JSON.stringify({ _id, name, isAdmin, token })
    );
  };

  const removeUserToLocalStorage = () => localStorage.removeItem('userData');

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

  const logout = async () => {
    await fetch(`/api/user/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: 'LOGOUT_USER_SUCCESS' });
    removeUserToLocalStorage();
  };

  const logoutAll = async () => {
    await fetch(`/api/user/logoutall`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: 'LOGOUT_USER_SUCCESS' });
    removeUserToLocalStorage();
  };

  const update = async ({ name, email, currentPassword, newPassword }) => {
    try {
      const response = await fetch(`/api/user/updateprofile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          password: newPassword,
        }),
      });

      const data = await response.json();
      const { _id, isAdmin, message } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: { _id, name, isAdmin, message },
      });

      clearAlert();
    } catch (error) {
      dispatch({ type: 'UPDATE_USER_FAIL', payload: error });
    }
  };

  return (
    <UserContext.Provider
      value={{ ...userState, login, register, logout, logoutAll, update }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };

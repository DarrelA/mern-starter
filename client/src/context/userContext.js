import React, { useReducer } from 'react';

const UserContext = React.createContext({
  userId: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  login: () => {},
});

const initialState = { userId: '' };

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER_SUCCESS': {
      const { userId, name, isAdmin, token } = action.payload;
      return { ...state, userId, name, isAdmin, token };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, message: action.payload.error };
    }

    case 'REGISTER_USER_SUCCESS': {
      const { userId, name, isAdmin, token } = action.payload;
      return { ...state, userId, name, isAdmin, token };
    }

    case 'REGISTER_USER_FAIL': {
      return { ...state, message: action.payload.error };
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

      if (!response.ok) throw new Error('Invalid credentials.');

      const { _id, name, isAdmin, token } = await response.json();
      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { userId: _id, name, isAdmin, token },
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

      const { _id, isAdmin, token } = await response.json();
      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: { userId: _id, name, isAdmin, token },
      });

      addUserToLocalStorage(_id, name, isAdmin, token);
    } catch (error) {
      dispatch({ type: 'REGISTER_USER_FAIL', payload: error });
    }
  };

  const userContext = { userId: userState.id, login, register };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};

export { UserContext as default, UserProvider };

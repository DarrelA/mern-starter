import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext({ _id: '', message: '' });
const { googleId, _id, avatar, name, token, isAdmin } = {
  ...JSON.parse(localStorage.getItem('userData')),
  ...JSON.parse(localStorage.getItem('avatar')),
};

const initialState = {
  googleId: googleId || '',
  _id: _id || '',
  avatar: avatar || '',
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

    case 'FETCH_USER_SUCCESS': {
      const { _id, avatar, name, isAdmin, token } = action.payload;
      return { ...state, _id, avatar, name, isAdmin, token, message: '' };
    }

    case 'FETCH_USER_FAIL': {
      return { ...state, message: action.payload.message };
    }

    case 'LOGIN_USER_SUCCESS': {
      const { _id, avatar, name, isAdmin, token } = action.payload;
      return { ...state, _id, avatar, name, isAdmin, token, message: '' };
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

    case 'UPLOAD_AVATAR_SUCCESS': {
      const { avatar } = action.payload;
      return { ...state, avatar };
    }

    case 'UPLOAD_AVATAR_FAIL': {
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

  const removeUserToLocalStorage = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('avatar');
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      const { _id, avatar, name, isAdmin, googleId } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'FETCH_USER_SUCCESS',
        payload: { _id, avatar, name, isAdmin, token, googleId },
      });

      localStorage.setItem(
        'userData',
        JSON.stringify({ _id, name, isAdmin, token, googleId })
      );
      localStorage.setItem('avatar', JSON.stringify({ avatar }));
    } catch (e) {}
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const { _id, avatar, name, isAdmin, token } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { _id, avatar, name, isAdmin, token },
      });

      localStorage.setItem(
        'userData',
        JSON.stringify({ _id, name, isAdmin, token })
      );
      localStorage.setItem('avatar', JSON.stringify({ avatar }));
    } catch (e) {
      dispatch({ type: 'LOGIN_USER_FAIL', payload: e });
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

      localStorage.setItem(
        'userData',
        JSON.stringify({ _id, name, isAdmin, token })
      );
    } catch (e) {
      dispatch({ type: 'REGISTER_USER_FAIL', payload: e });
    }
  };

  const logout = async () => {
    try {
      await fetch(`/api/user/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      removeUserToLocalStorage();
    } catch (e) {
      console.log(e);
    }
  };

  const logoutAll = async () => {
    try {
      await fetch(`/api/user/logoutall`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      removeUserToLocalStorage();
    } catch (e) {
      console.log(e);
    }
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
    } catch (e) {
      dispatch({ type: 'UPDATE_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const uploadAvatar = async (imageData) => {
    try {
      const response = await fetch(`/api/user/uploadavatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: imageData,
      });

      const data = await response.json();
      const { avatar } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'UPLOAD_AVATAR_SUCCESS', payload: { avatar } });

      localStorage.setItem('avatar', JSON.stringify({ avatar }));
      clearAlert();
    } catch (e) {
      dispatch({ type: 'UPLOAD_AVATAR_FAIL', payload: e });
      clearAlert();
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        fetchUser,
        login,
        register,
        logout,
        logoutAll,
        update,
        uploadAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };

import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext();
const { passport, _id, avatar, name } =
  JSON.parse(localStorage.getItem('userData')) || {};

const initialState = {
  isLoading: false,
  passport: passport || true,
  _id: _id || '',
  avatar: avatar || '',
  name: name || '',
  isAdmin: false,
  message: '',
  accessToken: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_STATE': {
      return { ...state, message: '' };
    }

    case 'REFRESH_TOKEN_SUCCESS': {
      const { accessToken } = action.payload;
      return { ...state, accessToken };
    }

    case 'IS_LOADING': {
      return { ...state, isLoading: true };
    }

    case 'LOGIN_USER_SUCCESS': {
      const { passport, _id, avatar, name, isAdmin, accessToken } =
        action.payload;
      return {
        ...state,
        isLoading: false,
        passport,
        _id,
        avatar,
        name,
        isAdmin,
        accessToken,
      };
    }

    case 'LOGIN_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'REGISTER_USER_SUCCESS': {
      const { passport, _id, name, accessToken } = action.payload;
      return { ...state, isLoading: false, passport, _id, name, accessToken };
    }

    case 'REGISTER_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'LOGOUT_USER_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        _id: '',
        name: '',
        isAdmin: '',
        message: '',
        accessToken: '',
      };
    }

    case 'UPDATE_USER_SUCCESS': {
      const { _id, name, isAdmin, message } = action.payload;
      return { ...state, isLoading: false, _id, name, isAdmin, message };
    }

    case 'UPDATE_USER_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'UPLOAD_AVATAR_SUCCESS': {
      const { avatar } = action.payload;
      return { ...state, isLoading: false, avatar };
    }

    case 'UPLOAD_AVATAR_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    default:
      return initialState;
  }
};

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const clearAlert = () =>
    setTimeout(() => dispatch({ type: 'CLEAR_STATE' }, 500));

  const addUserDataToLocalStorage = async (passport, _id, avatar, name) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedUserData = {
      passport: passport ?? userData.passport,
      _id: _id || userData._id,
      avatar: avatar || userData.avatar,
      name: name || userData.name,
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const checkRefreshToken = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/refresh_token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      const { accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'REFRESH_TOKEN_SUCCESS', payload: { accessToken } });
    } catch (e) {}
  }, []);

  const fetchPassportUserData = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/passport_user`, {
        credentials: 'include',
      });

      const data = await response.json();
      const { passport, _id, avatar, name, isAdmin } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'FETCH_PASSPORT_USER_SUCCESS',
        payload: { passport, _id, avatar, name, isAdmin },
      });

      addUserDataToLocalStorage(passport, _id, avatar, name, isAdmin);
      clearAlert();
    } catch (e) {}
  }, []);

  const login = async ({ email, password }) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const { passport, _id, avatar, name, isAdmin, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { passport, _id, avatar, name, isAdmin, accessToken },
      });

      addUserDataToLocalStorage(passport, _id, avatar, name);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'LOGIN_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const register = async ({ name, email, password }) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/user/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      const { passport, _id, accessToken } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: { passport, _id, name, accessToken },
      });

      addUserDataToLocalStorage(passport, _id, '', name, accessToken);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'REGISTER_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const logout = async () => {
    dispatch({ type: 'IS_LOADING' });
    try {
      await fetch(`/api/user/logout`, {
        method: 'POST',
        headers: { credentials: 'include' },
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      localStorage.removeItem('userData');
      clearAlert();
    } catch (e) {
      console.log(e);
      clearAlert();
    }
  };

  const update = async ({ name, email, newPassword }, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/user/updateprofile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password: newPassword }),
      });

      const data = await response.json();
      const { passport, _id, message } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: { _id, name, message },
      });

      addUserDataToLocalStorage(passport, _id, '', name);
      clearAlert();
    } catch (e) {
      dispatch({ type: 'UPDATE_USER_FAIL', payload: e });
      clearAlert();
    }
  };

  const uploadAvatar = async (imageData, accessToken) => {
    dispatch({ type: 'IS_LOADING' });
    try {
      const response = await fetch(`/api/user/uploadavatar`, {
        method: 'POST',
        headers: { authorization: `Bearer ${accessToken}` },
        body: imageData,
      });

      const data = await response.json();
      const { avatar } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({ type: 'UPLOAD_AVATAR_SUCCESS', payload: { avatar } });
      addUserDataToLocalStorage(avatar);
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
        checkRefreshToken,
        fetchPassportUserData,
        login,
        register,
        logout,
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

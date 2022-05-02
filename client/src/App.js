import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import useUserContext from './context/userContext';
import {
  Landing,
  NotFound,
  RegisterLogin,
  SharedLayout,
} from './pages/index.js';

const App = () => {
  const { passport, checkRefreshToken, fetchPassportUserData } =
    useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    fetchPassportUserData();
  }, [fetchPassportUserData]);

  useEffect(() => {
    if (!passport) checkRefreshToken();
  }, [passport, checkRefreshToken]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<RegisterLogin />} />
      <Route path="/dashboard" element={<SharedLayout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/userContext.js';
import {
  Landing,
  NotFound,
  RegisterLogin,
  SharedLayout,
} from './pages/index.js';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterLogin />} />
          <Route path="/dashboard" element={<SharedLayout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserProvider>
  );
};

export default App;

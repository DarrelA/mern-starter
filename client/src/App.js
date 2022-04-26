import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/userContext.js';
import { Landing, NotFound, RegisterLogin } from './pages/index.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserProvider>
  );
};

export default App;

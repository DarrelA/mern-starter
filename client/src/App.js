import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/userContext.js';
import { Landing, NotFound, RegisterLogin } from './pages/index.js';

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
    </UserProvider>
  );
};

export default App;

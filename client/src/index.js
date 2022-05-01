import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { UserProvider } from './context/userContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer />
  </UserProvider>
);

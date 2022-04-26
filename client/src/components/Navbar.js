import useUserContext from '../context/userContext';
import { Link } from 'react-router-dom';
import mernLogo from '../assets/images/mern-logo.jpeg';

const Navbar = () => {
  const { _id, logout } = useUserContext();

  return (
    <header className="header">
      <Link to="/">
        <img src={mernLogo} alt="logo" className="logo" />
      </Link>

      <nav className="main-nav">
        <ul className="main-nav-list">
          {!_id && (
            <li>
              <Link to="/register" className="main-nav-link nav-cta">
                Login
              </Link>
            </li>
          )}

          {_id && (
            <>
              <li>
                <Link to="/" className="main-nav-link" onClick={logout}>
                  Logout
                </Link>
              </li>
              <li>
                <Link to="/profile" className="main-nav-link nav-cta">
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

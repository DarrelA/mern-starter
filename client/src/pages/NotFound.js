import { Link } from 'react-router-dom';
import notFound from '../assets/svg/error-404-monochrome.svg';

const NotFound = () => {
  return (
    <div className="container center">
      <img
        src={notFound}
        alt="not found"
        style={{ width: '50%', marginBottom: '2rem' }}
      />
      <h3 style={{ marginBottom: '0.5rem' }}>Oh no! Page Not Found</h3>
      <p>We can't seem to find the page you're looking for</p>
      <Link to="/">back home</Link>
    </div>
  );
};

export default NotFound;

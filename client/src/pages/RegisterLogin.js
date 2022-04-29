import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/icons8-google.svg';
import useUserContext from '../context/userContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const userContext = useUserContext();
  const [formData, setFormData] = useState(initialState);
  const [registerPage, showRegisterPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userContext.token || userContext.googleId) return navigate('/');
    if (!!userContext.message) toast.error(userContext.message);
  }, [userContext.token, userContext.googleId, navigate, userContext.message]);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();

    if (registerPage) {
      if (formData.password.length <= 7)
        return toast.error('Password needs to have at least 7 characters.');
      if (formData.password !== formData.confirmPassword)
        return toast.error('Password does not match!');

      userContext.register(formData);
    } else userContext.login(formData);
  };

  const registerPageHandler = () => showRegisterPage((prevState) => !prevState);

  return (
    <section className="container center" id="cta">
      <form className="form" onSubmit={submitHandler}>
        <h2>{registerPage ? 'Register' : 'Login'}</h2>
        {registerPage && (
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Mong Kong"
              required
              onChange={inputHandler}
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mongkong@gmail.com"
            required
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={inputHandler}
          />
        </div>

        {registerPage && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={inputHandler}
            />
          </div>
        )}

        <button className="btn btn--form">
          {registerPage ? 'Register' : 'Login'}
        </button>

        <p>
          {registerPage ? 'Already a member?' : 'Not a member yet?'}
          <button
            className="btn btn--form btn--small"
            type="button"
            onClick={registerPageHandler}
          >{`${registerPage ? 'Go to Login' : 'Sign up now!'}`}</button>
        </p>

        <h4>
          <span>OR</span>
        </h4>

        <div className="passport">
          <a href="/api/auth/google">
            <img src={googleIcon} alt="google" />
          </a>
        </div>
      </form>
    </section>
  );
};

export default Register;

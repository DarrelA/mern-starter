import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <section class="container center" id="cta">
      <form class="form">
        <h2>Login</h2>
        <div>
          <label for="full-name">Full Name</label>
          <input
            type="text"
            name="full-name"
            id="full-name"
            placeholder="Mong Kong"
            required
          />
        </div>

        <div>
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mongkong@gmail.com"
            required
          />
        </div>

        <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>

        <div>
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
          />
        </div>

        <button class="btn btn--form">Sign up now</button>
      </form>
    </section>
  );
};

export default Register;

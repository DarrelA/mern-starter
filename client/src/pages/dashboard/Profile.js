import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../../context/userContext';
import { ImageUpload } from '../../components/';

const initialState = {
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const Profile = () => {
  const userContext = useUserContext();
  const [formData, setFormData] = useState(initialState);

  const navigate = useNavigate();
  const imageData = new FormData();
  const imageHandler = (pickedFile) => imageData.append('image', pickedFile);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();
    if (!formData.currentPassword)
      return toast.error('Current password is required to update.');
    if (!!formData.newPassword) {
      if (formData.newPassword.length <= 7)
        return toast.error('Password needs to have at least 7 characters.');
      if (formData.newPassword !== formData.confirmPassword)
        return toast.error('Password does not match!');
    }

    userContext.update(formData);
  };

  useEffect(() => {
    if (!userContext._id) return navigate('/');
    if (userContext.message === 'success') return navigate('/');
    if (!!userContext.message) toast.error(userContext.message);
  }, [userContext._id, navigate, userContext.message]);

  return (
    <section className="container center">
      <button
        className="btn btn--form btn--alone"
        onClick={userContext.logoutAll}
      >
        Logout from all devices
      </button>

      <form className="form" onSubmit={submitHandler}>
        <h2>Update Profile</h2>

        <ImageUpload id="image" onImageInput={imageHandler} />

        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Mong Kong"
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mongkong@gmail.com"
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={inputHandler}
          />
        </div>

        <button className="btn btn--form">Update</button>
      </form>
    </section>
  );
};

export default Profile;
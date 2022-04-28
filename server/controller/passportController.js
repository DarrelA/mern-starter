import passport from 'passport';

const googleOauth20 = passport.authenticate('google', { scope: ['profile'] });

const googleOauth20Callback = () =>
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  });

const passportLogout = (req, res) => {
  req.logout(); // passport.js
  req.session.destroy();
  res.redirect('/');
};

export { googleOauth20, googleOauth20Callback, passportLogout };

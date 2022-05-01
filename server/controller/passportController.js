import passport from 'passport';

const googleRedirect = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleCallback = passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
});

const passportLogout = (req, res) => {
  req.logout(); // passport.js
  req.session.destroy();
  res.redirect('/');
};

export { googleRedirect, googleCallback, passportLogout };

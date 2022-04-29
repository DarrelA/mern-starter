import passport from 'passport';

const google = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/register',
});

const passportLogout = (req, res) => {
  req.logout(); // passport.js
  req.session.destroy();
  res.redirect('/');
};

export { google, googleCallback, passportLogout };

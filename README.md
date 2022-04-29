## About The Project

- A boilerplate for web applications using MERN stack

&nbsp;

## Issues

- logoutall does not logout because of fetchUser() in useEffect() in Navbar.js
  - it only happens when user refresh the page before clicking logoutall
- Not redirected when token is expired (Timer required)

## Features

- Hash db password with bcryptjs with JWT stored in local storage for persist login
  - logoutAll button to empty the array of tokens in db
- Upload avatar image to Amazon S3
- Change name, email or password for account registered with email
- Google OAuth

## Future

- Replace localstorage with refresh tokens
- Dark mode

&nbsp;

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import express from "express";

passport.use(new GoogleStrategy({
    clientID: "378127026206-5g7mk3168kmtiga0opeko4kvvufg31cb.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:3001/oAuth/google/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

  export default router;
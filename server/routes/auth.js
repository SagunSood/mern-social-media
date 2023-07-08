import express from "express";
import { login } from "../controllers/auth.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
//var passport = require('passport');
//var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "http://378127026206-3ia6kajc51dlpfnco3f1jmjav2637tpi.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const router = express.Router();

router.post("/login", login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

export default router;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    // Your existing code for registering a user
    // ...
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
// 
export const login = (req, res) => {
  // Authentication will be handled by Passport middleware
  res.send("Authentication successful!");
};


// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Local strategy for email/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:"378127026206-5g7mk3168kmtiga0opeko4kvvufg31cb.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/oAuth/google/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Handle the Google authentication callback
      // Check if the user is already registered in your MongoDB instance
      // If the user exists, call `done(null, user)` to proceed with authentication
      // If the user does not exist, you can create a new user or handle it as per your application's logic
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If the user doesn't exist, create a new user
          user = new User({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            // Set other user properties as needed
          });

          // Save the new user to the database
          await user.save();
        }

        // Pass the user object to the callback function to proceed with authentication
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);



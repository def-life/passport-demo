import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../models/User.js";
import helperFunctions from "../lib/helperFunc.js";
import GoogleStrategy from "passport-google-oidc";
import dotenv from "dotenv";

dotenv.config();

const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, username, password, cb) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return cb(null, false, { message: "Incorrect username or password." });
      }

      const hashedPassword = user.password;
      const match = await helperFunctions.verifyPassword(
        password,
        hashedPassword,
        cb
      );
      if (!match)
        cb(null, false, { message: "Incorrect username or password." });
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  }
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.NODE_GOOGLE_CLIENT_ID,
    clientSecret: process.env.NODE_GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/oauth2/redirect/google",
  },
  async function (issuer, profile, cb) {
    console.log(issuer, profile);

    try {
      const user = await User.findOne({
        providerName: "google",
        "providers.profileId": profile.id,
      });
      if (user) {
        return cb(null, user);
      } else {
        // save the user's first log in
        const newUser = new User({
          providers: [{ providerName: "google", profileId: profile.id }],
        });
        const savedUser = await newUser.save();
        return cb(null, savedUser);
      }
    } catch (err) {
      cb(err);
    }
  }
);

export default { localStrategy, googleStrategy };

import express from "express";
import passport from "passport";
import User from "../models/User.js";
import helperFunc from "../lib/helperFunc.js";
import strategy from "../config/passport.js";

const router = express.Router();

// register the strategy to passport
passport.use(strategy.localStrategy);
passport.use(strategy.googleStrategy);

// serialize function for  properties to add to the session store
// desieralize function for properties to get from the session store
passport.serializeUser(function (user, cb) {
  console.log("inside serialize func", user);
  process.nextTick(function () {
    console.log(
      "this is the user that will go to the session store",
      user,
      "only few of it's entries"
    );
    return cb(null, {
      id: user._id,
      username: user.username,
    });
  });
});


passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // hash the password
    const hashedPassword = await helperFunc.hashPassword(password);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/dashboard");
    });
  } catch (err) {
    next(err);
  }
});

router.get("/login", (req, res) => {
  console.log(req.session.messages);
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// google
router.get('/login/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/dashboard');
  });

export default router;

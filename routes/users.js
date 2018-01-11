const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");
const isLoggedIn = require("../middleware").isLoggedIn;
const notLoggedIn = require("../middleware").notLoggedIn;

const csrfProtection = csrf(); // start Cross-Site Request Forgery protection
router.use(csrfProtection);

// SIGNUP
router.get("/signup", notLoggedIn, function (req, res, next) {
  let messages = req.flash("error");
  res.render("signup", {csrfToken: req.csrfToken(), title: "GeckoMeet - Signup", messages: messages});
});

router.post("/signup", notLoggedIn, passport.authenticate("local-signup", {
  successRedirect: "create",
  failureRedirect: "signup",
  failureFlash: true
}));

// LOGIN
router.get("/login", notLoggedIn, (req, res, next) => {
  let messages = req.flash("error");
  res.render("login", {csrfToken: req.csrfToken(), title: "GeckoMeet - Signin", messages: messages});
});

router.post("/login", notLoggedIn, passport.authenticate("local-login", {
  successRedirect: "meetings",
  failureRedirect: "login",
  failureFlash: true
}));

// FACEBOOK
router.get("/auth/facebook", passport.authenticate("facebook", {
  scope: ["email"]
}));

router.get("/auth/facebook/oauthcallback", passport.authenticate("facebook", {
  successRedirect: "/meetings",
  failureRedirect: "/login"
}));

// GOOGLE
router.get("/auth/google", passport.authenticate("google", {
  scope: ["openid", "profile", "email"]
}));

router.get("/auth/google/oauth2callback", passport.authenticate("google", {
  successRedirect: "/meetings",
  failureRedirect: "/login"
}));

// LOGOUT
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

// PROFILE
router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile", {title: "GeckoMeet - Your Account"});
});

module.exports = router;

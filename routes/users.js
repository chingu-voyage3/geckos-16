const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");

const csrfProtection = csrf(); // start Cross-Site Request Forgery protection
router.use(csrfProtection);

router.get("/signup", notLoggedIn, function (req, res, next) {
  let messages = req.flash("error");
  res.render("signup", {csrfToken: req.csrfToken(), title: "GeckoMeet Signup", messages: messages});
});

router.post("/signup", notLoggedIn, passport.authenticate("local-signup", {
  successRedirect: "create",
  failureRedirect: "signup",
  failureFlash: true
}));

router.get("/login", notLoggedIn, (req, res, next) => {
  let messages = req.flash("error");
  res.render("login", {csrfToken: req.csrfToken(), title: "GeckoMeet Signin", messages: messages});
});

router.post("/login", notLoggedIn, passport.authenticate("local-login", {
  successRedirect: "meetings",
  failureRedirect: "login",
  failureFlash: true
}));

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("profile", {title: "Your Account"});
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

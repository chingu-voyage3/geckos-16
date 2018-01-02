const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const passport = require("passport");

const csrfProtection = csrf(); // start Cross-Site Request Forgery protection
router.use(csrfProtection);

router.get("/signup", function (req, res, next) {
  let messages = req.flash("error");
  res.render("user/signup", {csrfToken: req.csrfToken(), title: "GeckoMeet Signup", messages: messages});
});

router.post("/signup", passport.authenticate("local-signup", {
  successRedirect: "/profile",
  failureRedirect: "/signup",
  failureFlash: true
}));

router.get("/profile", (req, res, next) => {
  res.render("user/profile");
});

router.get("/login", (req, res, next) => {
  let messages = req.flash("error");
  res.render("user/login", {csrfToken: req.csrfToken(), title: "GeckoMeet Signin", messages: messages});
});

router.post("/login", passport.authenticate("local-login", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}));

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

module.exports = router;

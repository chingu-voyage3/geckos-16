const router = require("express").Router();
const passport = require("passport");
const appName = "GeckoMeet";

router.get("/facebook",
  passport.authorize("facebook", {
  scope: ["public_profile", "email"]
}));

router.get("/google",
  passport.authorize("google", {
  scope: ["profile", "email"]
}));

router.get("/local", (req, res) => {
  const messages = req.flash("error");
  res.render("connect-local", {title: appName, messages: messages, user: req.user})
});

router.post("/local",
  passport.authenticate("local-signup", {
    successRedirect: "../profile",
    failureRedirect: "/connect/local",
    failureFlash: true
  }));

module.exports = router;
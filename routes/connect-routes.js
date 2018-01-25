const router = require("express").Router();
const passport = require("passport");
const appName = "GeckoMeet";

router.get("/facebook",
  passport.authorize("facebook", {
  scope: ["public_profile", "email"]
}));

router.get("/unlink/facebook", (req, res) => {
  const user = req.user;

  user.facebook.id = null;
  user.facebook.token = null;
  user.facebook.name = null;
  user.facebook.email = null;

  user.save((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/profile");
  });
});

router.get("/google",
  passport.authorize("google", {
  scope: ["profile", "email"]
}));

router.get("/unlink/google", (req, res) => {
  const user = req.user;

  user.google.id = null;
  user.google.token = null;
  user.google.name = null;
  user.google.email = null;

  user.save((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/profile");
  });
});

router.get("/local", (req, res) => {
  const messages = req.flash("error");
  res.render("connect-local", {title: appName, messages: messages, user: req.user})
});

router.post("/local",
  passport.authenticate("local-signup", {
    successRedirect: "../profile",
    failureRedirect: "/connect/local",
    failureFlash: true
  })
);

router.get("/unlink/local", (req, res) => {
  const user = req.user;

  user.local.email = null;
  user.local.name = null;
  user.local.password = null;

  user.save((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/profile");
  });
});

module.exports = router;
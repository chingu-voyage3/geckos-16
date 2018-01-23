const router = require("express").Router();
const passport = require("passport");
const isLoggedIn = require("../middleware").isLoggedIn;
const notLoggedIn = require("../middleware").notLoggedIn;
const appName = "GeckoMeet";

// auth login
router.get("/login", notLoggedIn, (req, res) => {
  const messages = req.flash("error");
  res.render("login", {title: "GeckoMeet - Log In", messages: messages, user: req.user});
});

router.post("/login", notLoggedIn, passport.authenticate("local-login", {
  successRedirect: "../profile",
  failureRedirect: "login",
  failureFlash: true
}));

// auth logout
router.get("/logout", isLoggedIn, (req, res) => {
  // handled by passport
  req.logout();
  res.redirect("/");
});

/***************
 * Local Signup
 ***************/

 router.get("/signup", notLoggedIn, (req, res) => {
  const messages = req.flash("error");
  res.render("signup", {title: `${appName} - Sign Up`, messages: messages, user: req.user});
 });

 router.post("/signup", notLoggedIn, passport.authenticate("local-signup", {
  successRedirect: "../profile",
  failureRedirect: "signup",
  failureFlash: true
 }));

/*********
 * Google
 *********/
// auth with google
router.get("/google", notLoggedIn,
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// google callback route
router.get("/google/oauth2callback",
  passport.authenticate("google"),  
  // passport callback function is fired before following code is executed
  (req, res) => {
    res.redirect("/profile");
  }
);

/***********
 * Facebook
 ***********/
// auth with facebook
router.get("/facebook", notLoggedIn,
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"]
  })
);

// facebook callback route
router.get("/facebook/oauthcallback",
  passport.authenticate("facebook"),
  // passport callback function is fired before following code is executed
  (req, res) => {
    res.redirect("/profile");
  }
);

module.exports = router;
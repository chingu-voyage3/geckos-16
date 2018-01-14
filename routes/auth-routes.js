const router = require("express").Router();
const passport = require("passport");
const isLoggedIn = require("../middleware").isLoggedIn;
const notLoggedIn = require("../middleware").notLoggedIn;

// auth login
router.get("/login", (req, res) => {
  res.render("login", {title: "GeckoMeet - Log In", user: req.user});
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  req.logout();
  res.redirect("/");
});

/*********
 * Google
 *********/
// auth with google
router.get("/google",
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
router.get("/facebook",
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
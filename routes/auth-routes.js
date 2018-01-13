const router = require("express").Router();

// auth login
router.get("/login", (req, res) => {
  res.render("login", {title: "GeckoMeet - Log In"});
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  res.send("logging out");
});

// auth with google
router.get("/google", (req, res) => {
  // handle with passport
  res.send("logging in with google");
});

// auth with facebook
router.get("/facebook", (req, res) => {
  // handle with passport
  res.send("logging in with facebook");
});

module.exports = router;
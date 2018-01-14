const router = require("express").Router();
const isLoggedIn = require("../middleware").isLoggedIn;

router.get("/", isLoggedIn, (req, res) => {
  let name = req.user.google.name || req.user.facebook.name;
  res.render("profile", {title: "GeckoMeet", user: req.user});
});


module.exports = router;
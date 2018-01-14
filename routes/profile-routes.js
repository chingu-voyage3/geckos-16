const router = require("express").Router();
const isLoggedIn = require("../middleware").isLoggedIn;

router.get("/", isLoggedIn, (req, res) => {
  let name = req.user.google.name || req.user.facebook.name;
  res.send("your profile: " + name);
});


module.exports = router;
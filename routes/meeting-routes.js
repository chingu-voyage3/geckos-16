const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Meetings List");
});

router.get("/meeting-detail", (req, res) => {
  res.send("Meeting Detail");
});

router.get("/create", (req, res) => {
  res.send("Ceate a meeting");
});

module.exports = router;
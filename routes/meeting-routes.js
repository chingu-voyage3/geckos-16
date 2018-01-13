const router = require("express").Router();

router.get("/meetings", (req, res) => {
  res.send("Meetings List");
});

router.get("/meeting-detail", (req, res) => {
  res.send("Meeting Detail");
});

module.exports = router;
const router = require("express").Router();
const meeting_controller = require('../controllers/meeting-controller');
const isLoggedIn = require("../middleware").isLoggedIn;

// GET request for creating a Meeting. NOTE This must come before routes that display Meeting (uses id).
router.get("/create", isLoggedIn, meeting_controller.meeting_create_get);

// POST request for creating Meeting.
router.post("/create", isLoggedIn, meeting_controller.meeting_create_post);

// GET request to delete Meeting.
router.get("/meeting-detail/:id/delete", isLoggedIn, meeting_controller.meeting_delete_get);

router.get("/delete/:id", isLoggedIn, meeting_controller.meeting_delete_post);

// GET request to update Meeting.
router.get("/meeting-detail/:id/edit", isLoggedIn, meeting_controller.meeting_edit_get);

// POST request to update Meeting.
router.post("/meeting-detail/:id/edit", isLoggedIn, meeting_controller.meeting_edit_post);

// GET request for one Meeting.
router.get("/meeting-detail/:id", meeting_controller.meeting_detail);

// GET request for list of all Meeting items.
router.get('/', isLoggedIn, meeting_controller.meetings);

module.exports = router;

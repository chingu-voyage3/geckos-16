const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;
const dbURL =
  "mongodb://gecko16:gecko16rulez@ds157158.mlab.com:57158/meeting-planner-mvp";
var db;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(dbURL, (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
});

app.get("/", function(req, res) {
  db
    .collection("meetings")
    .find()
    .toArray(function(err, result) {
      if (err) return console.log(err);
      res.render("index.ejs", { meetings: result });
    });
});

app.post("/meetings", (req, res) => {
  db.collection("meetings").save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log("saved to database");
    res.redirect("/");
  });
});

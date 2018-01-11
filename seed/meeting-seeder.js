const Meeting = require("../models/meeting");

const mongoose = require("mongoose");

const dbURL = process.env.MONGODB_URI || require("../config/database").url;
mongoose.connect(dbURL);

var meetings = [
  new Meeting({
    title: "Dragon army vs Salamanders",
    //creator: ,
    description: "Ender Wiggin's Dragon Army take on Bonzo Madrid and the Salamander Army this weekend, don't miss it!",
    location: "The Battle Room",
    time: "Saturday, 08:00"
  }),
  new Meeting({
    title: "We're off to see the Wizard",
    //creator: ,
    description: "The Wonderful Wizard of Oz",
    location: "Emerald City, Oz",
    time: "TBD"
  }),
  new Meeting({
    title: "The Quidditch World Cup",
    //creator: ,
    description: "The Final - Ireland vs Bulgaria",
    location: "Dartmoor, England",
    time: "25 August"
  }),
];

let done = 0;
for (let i = 0; i < meetings.length; i++) {
  meetings[i].save(function(err, result) {
    done++;
    if (done === meetings.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}

const express = require("express");

const app = express();
const PORT = 3000;

app.listen(PORT, function() {
  console.log(`Server running on Port ${PORT}`);
});

app.get('/', function(req, res) {
  res.send('Hello World')
})

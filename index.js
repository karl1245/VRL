const express = require("express");
const path = require("path");
const generatePassword = require("password-generator");
const { Client } = require('pg');
var bodyParser = require("body-parser");

const client = new Client({
  connectionString: 'postgres://rqbnxajarbxirr:f9740610fcc4611b8d3ebecb745d3e72bb98f0d809ad5780e496dc080e296ea5@ec2-54-83-4-76.compute-1.amazonaws.com:5432/d83i9cuh2rvb1s',
  ssl: true,
});

client.connect();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json'}));
app.use(bodyParser.json({ type: 'html/text'}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Put all API endpoints under '/api'
app.post("/api/login", (req, res) => {
  let {username, password} = req.body;
  client.query(`select exists(select * from account where username = '${username}' and password = '${password}');`, (err, ans) => {
    if (err) throw err;
    if(ans.rows[0].exists){
      res.sendFile(path.join(__dirname + "/client/build/leht.html"));
    }
  });
  
})

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/leht.html"));
  res.end();
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);

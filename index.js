const express = require("express");
const path = require("path");
const { Client } = require("pg");
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var expressValidator = require("express-validator");
const {OAuth2Client} = require('google-auth-library');
const OAUTHCID="656090020496-s4loae0qcgon2psaacomcfftu57jdomk.apps.googleusercontent.com";
const Oauthclient = new OAuth2Client(OAUTHCID);

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://rqbnxajarbxirr:f9740610fcc4611b8d3ebecb745d3e72bb98f0d809ad5780e496dc080e296ea5@ec2-54-83-4-76.compute-1.amazonaws.com:5432/d83i9cuh2rvb1s",
  ssl: true
});

client.connect();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.json({ type: "html/text" }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(
  expressSession({ secret: "max", saveUninitialized: false, resave: false })
);

// Put all API endpoints under '/api'
app.post("/signup", async (req, res) => {
  let { username, password } = req.body;

  let userCount;
  try {
    userCount = await client.query(
      "SELECT COUNT(user_id) from account where username = $1",
      [username]
    );
  } catch (e) {
    res.writeHead(401);
    res.end();
    return;
  }

  if (userCount.rows[0].count > 0) {
    console.log("On olemas");
    res.writeHead(400);
    res.end("User already exists");
    return;
  }

  // create new user
  if (userCount.rows[0].count == 0) {
    try {
      // SELECT COUNT(user_id) from account where username = 'as'
      await client.query(
        `INSERT INTO account(username,password) VALUES('${username}' , '${password}')`
      );
    } catch (e) {
      res.writeHead(401);
      res.end();
      return;
    }
  }
  res.end();
});

app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  let userCount;
  try {
    userCount = await client.query(
      "SELECT email, username, user_id from account where username = $1 and password = $2 LIMIT 1",
      [username, password]
    );
  } catch (e) {
    res.writeHead(401);
    res.end();
    return;
  }

  if (userCount.rowCount > 0) {
    req.session.isLoggedIn = true;
    try {
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  } else {
    req.session.isLoggedIn = false;
    try {
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  }

  res.end();
});

app.post("/googleLogin", async (req, res) => {
  let token = await verify(req.headers.authorization).catch(console.error);

  let userCount;
  try {
    userCount = await client.query(
      "SELECT email, username, user_id from account where username = $1 and password = $2 LIMIT 1",
      [token['sub'], token['sub']]
    );
  } catch (e) {
    res.writeHead(401);
    res.end();
    return;
  }
  
  if (userCount.rowCount > 0) {
    console.log('jey');
    
    req.session.isLoggedIn = true;
    try {
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  } else {
    try {
      await client.query(
        `INSERT INTO account(username,password) VALUES('${token['sub']}' , '${token['sub']}')`
      );
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  }

  res.end();
});
app.post("/isLoggedIn", async (req, res) => {
  res.contentType("application/json");
  res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
});
app.post("/logout", async (req, res) => {
  req.session.isLoggedIn = false;

  res.json({ isLoggedIn: false });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

async function verify(token) {
  const ticket = await Oauthclient.verifyIdToken({
      idToken: token,
      audience: OAUTHCID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = await ticket.getPayload();
  return payload;
}

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Password generator listening on ${port}`);

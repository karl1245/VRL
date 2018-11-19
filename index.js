const express = require("express");
const path = require("path");
const { Client } = require("pg");
var bodyParser = require("body-parser");
const fetch = require("node-fetch");
var expressSession = require("express-session");
var expressValidator = require("express-validator");
const port = process.env.PORT || 5000;
const crypto = require("crypto");

const app = express();

var server = app.listen(port, function() {
  console.log(`Listening on ${port}`);
});
var socket = require("socket.io");
io = socket(server);
io.on("connection", socket => {
  console.log(socket.id);

  socket.on("SEND_MESSAGE", function(data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});

const { OAuth2Client } = require("google-auth-library");
const OAUTHCID =
  "656090020496-s4loae0qcgon2psaacomcfftu57jdomk.apps.googleusercontent.com";
const Oauthclient = new OAuth2Client(OAUTHCID);

const client = new Client({
  connectionString:
    process.env.DATABASE_URL,
  ssl: true
});

client.connect();

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

// Put all API endpoints under '/api'
app.post("/api/signup", async (req, res) => {
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

app.post("/api/login", async (req, res) => {
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

app.post("/api/googleLogin", async (req, res) => {
  let token = await verify(req.headers.authorization).catch(console.error);

  let userCount;
  try {
    userCount = await client.query(
      `SELECT email, username, user_id from account where username = '${token["sub"]}' and password = '${token["sub"]}'`
    );
  } catch (e) {
    res.writeHead(401);
    res.end();
    return;
  }

  if (userCount.rowCount > 0) {
    console.log("jey");

    req.session.isLoggedIn = true;
    try {
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  } else {
    req.session.isLoggedIn = true;
    try {
      await client.query(
        `INSERT INTO account(username,password) VALUES('${token["sub"]}' , '${
          token["sub"]
        }')`
      );
      res.contentType("application/json");
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    } catch (e) {}
  }

  res.end();
});
app.post("/api/isLoggedIn", async (req, res) => {
  res.contentType("application/json");
  res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
});
app.post("/api/logout", async (req, res) => {
  req.session.isLoggedIn = false;

  res.json({ isLoggedIn: false });
});
app.post("/api/smartid", async (req, res) => {
  let { isikukood, riik } = req.body;
  const buf = crypto.randomBytes(32);
  const hash = crypto.createHash("sha256");
  hash.update(buf);
  hashString = hash.digest("base64");
  fetch(
    `https://sid.demo.sk.ee/smart-id-rp/v1/authentication/pno/${riik}/${isikukood}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        relyingPartyUUID: "00000000-0000-0000-0000-000000000000",
        relyingPartyName: "DEMO",
        certificateLevel: "QUALIFIED",
        hashType: "SHA256",
        hash: hashString
      })
    }
  )
    .then(result => {
      if (result.status === 200) {
        return result.json();
      } else {
        console.log("Error");
        throw new Error("Error");
      }
    })
    .then(result => {
      const sessionID = result.sessionID;
      fetch(`https://sid.demo.sk.ee/smart-id-rp/v1/session/${sessionID}`, {
        method: "GET"
      })
        .then(result => {
          if (result.status === 200) {
            return result.json();
          } else {
            console.log("Error");
            throw new Error("Error");
          }
        })
        .then(result => {
          if (result.state === "COMPLETE" && result.result.endResult === "OK") {
            req.session.isLoggedIn = true;
            res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
          }
        });
    })
    .catch(err => {
      console.log(err);
      req.session.isLoggedIn = false;
      res.json({ isLoggedIn: Boolean(req.session.isLoggedIn) });
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.

async function verify(token) {
  const ticket = await Oauthclient.verifyIdToken({
    idToken: token,
    audience: OAUTHCID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = await ticket.getPayload();
  return payload;
}

console.log(`Password generator listening on ${port}`);

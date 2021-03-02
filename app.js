require("./utils/db");
const express = require("express");
const app = express();
app.use(express.json()); //this is a middleware which parses an request object to json object,
// so we can access it later
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Hello World") //"Hello World" is an example of res.text
})

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Server wants application/json!");
  } else {
    next();
  }
};

app.post("/", requireJsonContent, (req, res, next) => {
  res.status(201).send("Thanks for the JSON!");
});

const songRouter = require("./routes/song.route");
const movieRouter = require("./routes/movie.route");
const userRouter = require("./routes/user.route")

app.use("/songs", songRouter); // the "/songs" or "/movies" is the common route path 
app.use("/movies", movieRouter); //which all the routes in that particular module have
                                // hence for e.g. in song.route.js line 41 -> the route is actually going to the route path /songs + /:id => /songs/:id
app.use("/users", userRouter)

//Error handlers
//Synchronous error handler
/* app.get("/error", (req, res) => {
  // synchronous error
  const error = new Error("Not found.");
  error.statusCode = 404;
  throw error;
});
app.use((err, req, res, next) => {
  res.status(500);
  res.send(
    `${err} </br>
    <b>Error Stack:</b> ${err.stack}`
  );
}); */

// Asynchronous error handler
/* app.get("/error", (req, res, next) => {
  // assume some asynchronous error happens because of an network issue
  const err = new Error("Unexpected network error");
  next(err);
});


  app.use((err, req, res, next) => {
  try {
    console.log("I don't know how to handle network error. Pass it on.");
    next(err);
  } catch (err) {
    console.log("Unknown error. Pass it on.");
    next(err);
  }
}); */

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message); //must remember to end the request-response cycle
});

module.exports = app; //has to be the bottom of the file

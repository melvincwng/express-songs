const express = require("express");
const app = express();
app.use(express.json()); //this is a middleware which parses an request object to json object,
// so we can access it later

/* const songs2 = [
    {
      "name": "someSongName",
      "artist": "someSongArtist"
    },
    {
      "name": "anotherSongName",
      "artist": "anotherArtist"
    }
  ];
*/ 
  
// routes
/*app.get("/songs", (req, res) => {
    res.status(200).json(songs2);
  });

// middleware function to handle JSON post request
const requireJsonContent = (req, res, next) => {
if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Server wants application/json!");
} else {
    next();
}
};

app.post("/", requireJsonContent, (req, res, next) => {
    res.send("Thanks for the JSON!");
  }); */
  
// IMPORTANT NOTES (22.02.2021)
// lab answers for https://thoughtworks-sea.github.io/sgunited-guides/#/backend/express-parsing-request-body
// Remember 1) req.params AND 2) req.body AND 3) req.query (22.02.2021)
// Remember 4) res.text => whatever text you are returning back, that's res.text => e.g line 72 "Hello World" is an example of res.text
// AND 5) res.body => whatever you are returning back, that's res.body => e.g. line 94 newSong is the res.body (23.02.2021)

// if you see the Route Path is something like "/songs/:id" => this means there is a req.params = { id: some_number }
// if the URL is ..../songs/1 => this means some_number is "1" (1 in STRING form) hence req.params = { "id": "1" } 
// => take note since the number is in string, we need to parseInt() & convert to interger
// hence we can access req.params.id to get the value of 1

// For 'POST' or 'PUT' requests => this is means we will place some json object in the 'Body' > 'Raw' > 'JSON' > see empty space (put here the info we need to POST or PUT)
// Hence if I put this : 
/* {
  "name": "someSongName",
  "artist": "someSongArtist"
} in the empty box above the main box */ 
// there will be a req.body = { that object you key in the empty box, aka the information you are posting/putting, aka line58-61}
// hence since req.body is an object, I can access req.body.name OR req.body.artist to use as values in my request functions

// if you see the URL is something like "/songs?type="ROCK", ? means query string
// this means you will have a req.query object = { type: "ROCK"}
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

app.use("/songs", songRouter); // the "/songs" or "/movies" is the common route path 
app.use("/movies", movieRouter); //which all the routes in that particular module have
                                // hence for e.g. in song.route.js line 41 -> the route is actually going to the route path /songs + /:id => /songs/:id

module.exports = app; //has to be the bottom of the file

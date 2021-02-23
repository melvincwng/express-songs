const express = require("express");
const app = express();
app.use(express.json()); //this is a middleware which parses an request object to json object,
// so we can access it later

const songs = [
    {
    "id": 1,
    "name": "someSongNameeee",
    "artist": "someSongArtistttt"
  },
  {
    "id": 2,
    "name": "SUPERTEST",
    "artist": "somHAHAHeSongArtistttt"
  },
];

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
// Remember req.params AND req.body AND req.query (22.02.2021)
// Remember res.text => whatever text you are returning back, that's res.text AND res.body => whatever you are returning back, that's res.body(23.02.2021)

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

app.post("/songs", (req, res) => {
    let newSong = {
        id: songs.length + 1,
        name: req.body.name,
        artist:req.body.artist
    }
    songs.push(newSong)
    res.status(201).json(newSong); //newSong (the song object is an example of res.body)
  });

// (23.02.2021) lab exercises for https://thoughtworks-sea.github.io/sgunited-guides/#/backend/express-param-processing
// I commented out the answers for lab exercises for 22.02.2021
// app.param is for parameter processing
app.param("id", (req, res, next, id) => {
  let selectedSong = songs.find((song) => song.id === parseInt(req.params.id));
  req.song = selectedSong; // place the selectedSong object in the request object
  next();
})

// can try use array.find() instead => She said it's a better method than using index of song object in the array
app.get("/songs/:id", (req, res) => {
    // const selectedSong = songs[req.params.id - 1]
    // let selectedSong = songs.find((song) => song.id === parseInt(req.params.id))
    res.status(200).json(req.song);
    });

app.put("/songs/:id", (req, res) => {
    // const selectedSong = songs[req.params.id - 1];
    // selectedSong.name = req.body.name;
    // selectedSong.artist = req.body.artist;
    // res.status(200).json(selectedSong);
    req.song.name = req.body.name;
    req.song.artist = req.body.artist;
    res.status(200).json(req.song);
    });

// can try use array.find() instead => She said it's a better method than using index of song object in the array
app.delete("/songs/:id", (req, res) => {
    // let song = songs.find((song) => song.id === parseInt(req.params.id))
    // const deletedSong = songs[req.params.id - 1];
    // let index = songs.indexOf(song);
    // songs.splice(index, 1)
    // res.status(200).json(song);
    let index = songs.indexOf(req.song);
    songs.splice(index, 1)
    res.status(200).json(req.song);
    });

const movies = [];

app.post("/movies", (req, res) => {
  let newMovie = {
    id: movies.length + 1,
    movieName: req.body.movieName,
  }
  movies.push(newMovie)
  res.status(201).json(newMovie);

});

app.get("/movies", (req, res) => {
  res.status(200).json(movies)
});

app.get("/movies/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id))
  res.status(200).json(selectedMovie)
});

app.put("/movies/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id));
  selectedMovie.movieName = req.body.movieName;
  res.status(200).json(selectedMovie)
})

app.delete("/movies/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id));
  const index = movies.indexOf(selectedMovie);
  movies.splice(index, 1)
  res.status(200).json(selectedMovie)
})

module.exports = app; //has to be the bottom of the file

const express = require("express");
const router = express.Router();
const Joi = require("joi");

// DATA:
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

// Validation is for POST and PUT requests
function validateSong(song) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3).required(),
    artist: Joi.string().min(3).required(),
  });
  return schema.validate(song); //returns a result object {error: , value:}
}


// PARAM PROCESSING:
// (23.02.2021) lab exercises for https://thoughtworks-sea.github.io/sgunited-guides/#/backend/express-param-processing
// I commented out the answers for lab exercises for 22.02.2021
// app.param is for parameter processing
router.param("id", (req, res, next, id) => {
    let selectedSong = songs.find((song) => song.id === parseInt(req.params.id));
    req.song = selectedSong; // place the selectedSong object in the request object
    next();
  })
  
// ROUTES:
// all the route paths here already have the pre-cursor route path /songs as seen in app.js
router.post("/", (req, res, next) => {
    let newSong = {
        id: songs.length + 1,
        name: req.body.name,
        artist:req.body.artist
    }

  // put in the validation logic here
  const validation = validateSong(req.body);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    // 400 Bad Request
    error.statusCode = 400;
    next(error); // goes to app.js the default error handler function at the bottom/
    }
    // else if validation is successful => we will push the song into the songs array
    songs.push(newSong)
    res.status(201).json(newSong); //newSong (the song object is an example of res.body)
  });

// can try use array.find() instead => She said it's a better method than using index of song object in the array
router.get("/:id", (req, res) => {
    // const selectedSong = songs[req.params.id - 1]
    // let selectedSong = songs.find((song) => song.id === parseInt(req.params.id))
    res.status(200).json(req.song);
    });

router.put("/:id", (req, res, next) => { // remember to put in 'next' since if got error, it will act as a middleware fn and pass to the error handler fn
    // const selectedSong = songs[req.params.id - 1];
    // selectedSong.name = req.body.name;
    // selectedSong.artist = req.body.artist;
    // res.status(200).json(selectedSong);

    // Validate the input we are sending over first before we change/update the song name & title.
    const validation = validateSong(req.body);
    if (validation.error) {
      const error = new Error(validation.error.details[0].message);
      // 400 Bad Request
      error.statusCode = 400;
      next(error);
      }

    req.song.name = req.body.name;
    req.song.artist = req.body.artist;
    res.status(200).json(req.song);
    });

// can try use array.find() instead => She said it's a better method than using index of song object in the array
router.delete("/:id", (req, res) => {
    // let song = songs.find((song) => song.id === parseInt(req.params.id))
    // const deletedSong = songs[req.params.id - 1];
    // let index = songs.indexOf(song);
    // songs.splice(index, 1)
    // res.status(200).json(song);
    let index = songs.indexOf(req.song);
    songs.splice(index, 1)
    res.status(200).json(req.song);
    });

module.exports = router;
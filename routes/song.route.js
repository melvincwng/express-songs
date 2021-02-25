const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Song = require("../models/song.model"); //replacing joi validation with mongoose validation (25.02.21)

// DATA:
/* const songs = [
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
]; */

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
router.param("id", async (req, res, next, id) => {
    // let selectedSong = songs.find((song) => song.id === parseInt(req.params.id));
    //req.song = selectedSong; // place the selectedSong object in the request object
    //next();
    const selectedSong = await Song.findById(req.params.id)
    req.song = selectedSong;
    next()
  })
  
// ROUTES:
// all the route paths here already have the pre-cursor route path /songs as seen in app.js
router.post("/", async (req, res, next) => {
    /* let newSong = {
        id: songs.length + 1,
        name: req.body.name,
        artist:req.body.artist
    } */
    try {
      const newSong = new Song(req.body); //creating an instance of the model -> an instance of a model equals to a document
      await newSong.save(); //saves the song into database
      res.status(201).json(newSong);
    } catch (error) {
        next(error)
    }
    
  // put in the validation logic here
  /* const validation = validateSong(req.body);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    // 400 Bad Request
    error.statusCode = 400;
    next(error); // goes to app.js the default error handler function at the bottom/
    }
    // else if validation is successful => we will push the song into the songs array */
    // songs.push(newSong)
   //newSong (the song object is an example of res.body)
  }); 

// can try use array.find() instead => She said it's a better method than using index of song object in the array
router.get("/:id", async (req, res) => {
    // const selectedSong = songs[req.params.id - 1]
    // let selectedSong = songs.find((song) => song.id === parseInt(req.params.id))
    res.status(200).json(req.song);
    });

router.put("/:id", async (req, res, next) => { // remember to put in 'next' since if got error, it will act as a middleware fn and pass to the error handler fn
    // const selectedSong = songs[req.params.id - 1];
    // selectedSong.name = req.body.name;
    // selectedSong.artist = req.body.artist;
    // res.status(200).json(selectedSong);

    // Implementing JOI validation and MONGOOSE VALIDATION
    // Validate the input we are sending over first before we change/update the song name & title. (JOI)
    const validation = validateSong(req.body);
    if (validation.error) {
        const error = new Error(validation.error.details[0].message);
        // 400 Bad Request
        error.statusCode = 400;
        next(error);
      } else {
          //req.song.name = req.body.name;
          //req.song.artist = req.body.artist;
          try { // this part is MONGOOSE VALIDATION
            const song = await Song.findByIdAndUpdate(req.song.id, req.body, {new: true, runValidators:true}); // In the Song model, find an instance/document with that ID, and update it with the 2nd parameters. Song model contains all your model instances/documents
            res.status(200).json(song);
          } catch (err) {
              next(err);
          }
      }
    });

// can try use array.find() instead => She said it's a better method than using index of song object in the array
router.delete("/:id", async (req, res, next) => {
    // let song = songs.find((song) => song.id === parseInt(req.params.id))
    // const deletedSong = songs[req.params.id - 1];
    // let index = songs.indexOf(song);
    // songs.splice(index, 1)
    // res.status(200).json(song);
    try {
      await Song.findByIdAndDelete(req.song.id)
      res.status(200).json(req.song);
    } catch (err) {
        next(err)
    }
    
    });

module.exports = router;
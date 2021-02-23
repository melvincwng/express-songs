const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
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
router.param("id", (req, res, next, id) => {
  let selectedSong = songs.find((song) => song.id === parseInt(req.params.id));
  req.song = selectedSong; // place the selectedSong object in the request object
  next();
})

// can try use array.find() instead => She said it's a better method than using index of song object in the array
router.get("/:id", (req, res) => {
    // const selectedSong = songs[req.params.id - 1]
    // let selectedSong = songs.find((song) => song.id === parseInt(req.params.id))
    res.status(200).json(req.song);
    });

router.put("/:id", (req, res) => {
    // const selectedSong = songs[req.params.id - 1];
    // selectedSong.name = req.body.name;
    // selectedSong.artist = req.body.artist;
    // res.status(200).json(selectedSong);
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
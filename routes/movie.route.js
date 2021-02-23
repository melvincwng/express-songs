const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  let newMovie = {
    id: movies.length + 1,
    movieName: req.body.movieName,
  }
  movies.push(newMovie)
  res.status(201).json(newMovie);

});

router.get("/", (req, res) => {
  res.status(200).json(movies)
});

router.get("/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id))
  res.status(200).json(selectedMovie)
});

router.put("/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id));
  selectedMovie.movieName = req.body.movieName;
  res.status(200).json(selectedMovie)
})

router.delete("/:id", (req, res) => {
  const selectedMovie = movies.find((movie) => movie.id === parseInt(req.params.id));
  const index = movies.indexOf(selectedMovie);
  movies.splice(index, 1)
  res.status(200).json(selectedMovie)
})

module.exports = router;
const request = require("supertest");
const app = require("../app");
const Song = require("../models/song.model");
const { teardownMongoose } = require("../test/mongoose");

describe("songs", () => {
    afterAll(async () => await teardownMongoose());
  
    beforeEach(async () => {
      const songData = [
          {
            "name": "Song 1",
            "artist": "Artist 1"
          },
          {
            "name": "Song 2",
            "artist": "Artist 2"
          },
      ];
      await Song.create(songData);
    });
  
    afterEach(async () => {
      await Song.deleteMany();
    });

      it("GET /songs should return an array of songs", async () => {
        const songs = await Song.find({}); //find all the documents stored in the Song Model
        const expectedSongs = [
          {
            "name": "Song 1",
            "artist": "Artist 1"
          },
          {
            "name": "Song 2",
            "artist": "Artist 2"
          },
      ];
        const response = await request(app).get("/songs").expect(200);
        expect(response.body).toMatchObject(expectedSongs);
      });

    it("POST /songs should add a song and return a new song object", async () => {
        const newSong = { name: "Pink Moon", artist: "Nick Drake" };
        
        const response = await request(app)
          .post("/songs/")
          .send(newSong)
          .expect(201);
      
        expect(response.status).toEqual(201);
        expect(response.body).toMatchObject(newSong);
      });

      it("GET /songs/:id should return the correct song", async () => {
        const song = await Song.findOne({ name: "Song 1"});
        const response = await request(app).get(`/songs/${song._id}`).expect(200);
        expect(response.body.name).toEqual("Song 1");
      });

      it("PUT /songs/:id should update the song and return the song", async () => {
        const song = await Song.findOne({ name: "Song 1"});
        const newSong = { name: "Testing", artist: "Testing123"};
    
        const response = await request(app)
        .put(`/songs/${song._id}`)
        .send(newSong) //updating the first song with the newSong
        .expect(200)
    
        expect(response.body).toMatchObject(newSong);
      });

      it("DELETE /songs/:id should delete the song and return the deleted song", async () => {
        const song = await Song.findOne({ name: "Song 2" })
        const deletedSong = { name: "Song 2", artist: "Artist 2" };
    
        const response = await request(app).delete(`/songs/${song._id}`).expect(200)
    
        expect(response.body).toMatchObject(deletedSong);
      });
  });
const request = require("supertest");
const app = require("../app");
const Song = require("../models/song.model");
const { teardownMongoose } = require("../test/mongoose");
const User = require("../models/user.model");
const createJWTToken = require("../src/config/jwt");

describe("songs", () => {
    let token; // need to declare the token variable first. 
    // beforeAll is a function -> any variables declared in the function is function-scoped ->
    // which the test suites cannot access
    // hence for the test suites to access 'token' variable, we need to declare it outside first
    // then beforeAll function will run before all the test cases -> to set the value of token with createJWToken(user.username)

    // beforeAll fn will run before ALL the test cases
    // afterAll fn will run after ALL the test cases
    // beforeEach fn will run before EACH test case
    // afterEach fn will run after EACH test case
    // Refer to jest docs for more info: https://jestjs.io/docs/en/setup-teardown
    beforeAll(async () =>{
      const user = new User({username:"testing123", password:"testing123"});
      await user.save();

      token = createJWTToken(user.username);
    });

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

        describe("PUT requests", () => { 
          it("PUT /songs/:id should throw error when unauthorized user", async () => {
            const song = await Song.findOne({ name: "Song 1"});
            const newSong = { name: "Testing", artist: "Testing123"};
        
            const response = await request(app)
            .put(`/songs/${song._id}`)
            .send(newSong) //updating the first song with the newSong
            .expect(401)
            
            expect(response.status).toBe(401);
          });
    
          it("PUT /songs/:id should modify correct song successfully if authorised and given valid id", async () => {
            const song = await Song.findOne({ name: "Song 1"});
            const newSong = { name: "Testing", artist: "Testing123"};
        
            const response = await request(app)
            .put(`/songs/${song._id}`)
            .send(newSong) //updating the first song with the newSong
            .set("Cookie", `token=${token}`) // see more information below
            .expect(200)
            
            //.set('key', 'value') from StackOverFlow
            // if you see postman, when we send back a request back to server, with the cookie
            // basically, in the request headers, we are setting the 'key' as 'Cookie' (Setting the Cookie header)
            // and setting the 'value' with 'token=eyJhbGciOiJIUzI1N...'  (With a value of a JWT token)
            // hence just pass in those values above in line 96
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Testing')
            expect(response.body).toMatchObject(newSong)
          });
        });
      
        describe("DELETE requests", () => { 
          it("DELETE /songs/:id should throw an error when unauthorized user", async () => {
            const song = await Song.findOne({ name: "Song 2" })
            const deletedSong = { name: "Song 2", artist: "Artist 2" };
        
            const response = await request(app).delete(`/songs/${song._id}`).expect(401)
            
            expect(response.status).toBe(401);
          });
    
          it("DELETE /songs/:id should delete the correct song successfully if authorised and given valid id", async () => {
            const song = await Song.findOne({ name: "Song 2" })
            const deletedSong = { name: "Song 2", artist: "Artist 2" };
        
            const response = await request(app).delete(`/songs/${song._id}`).set("Cookie", `token=${token}`).expect(200)
            
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Song 2')
            expect(response.body).toMatchObject(deletedSong)
          });
        });
      
  });
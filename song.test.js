const request = require("supertest");
const app = require("./app");

describe("App", () => {
    it("POST /songs should add a song and return a new song object", async () => {
        const newSong = { name: "Pink Moon", artist: "Nick Drake" };
        const expectedSong = { id: 3, name: "Pink Moon", artist: "Nick Drake" };
      
        const response = await request(app)
          .post("/songs")
          .send(newSong)
          .expect(201);
      
        expect(response.status).toEqual(201);
        expect(response.body).toEqual(expectedSong);
      });

    /* it("POST /songs should add a song and return a new song object", async () => {
    const newSong = { name: "Pink Moon", artist: "Nick Drake" };
    const expectedSong = { id: 4, name: "Pink Moon", artist: "Nick Drake" };
    
    const { body: actualSong } = await request(app)
        .post("/songs")
        .send(newSong)
        .expect(201);

    expect(actualSong).toEqual(expectedSong);
    }); */

      it("GET /songs/:id should return the correct song", async () => {
        const expectedSong = {name: "Pink Moon", artist: "Nick Drake"};
    
        const { body: actualSong } = await request(app) //destructing response object
        .get("/songs/3")
        .expect(200)
    
        expect(actualSong).toMatchObject(expectedSong); // toMatchObject is lesser stricter than toEqual (e.g. property values like id are not compared)
      });

      it("PUT /songs/:id should update the song and return the song", async () => {
        const newSong = { name: "Testing", artist: "Testing123"};
    
        const { body: actualSong } = await request(app) //destructing response object
        .put("/songs/3")
        .send(newSong) //updating the previous song (with id=3) with the newSong
        .expect(200)
    
        expect(actualSong).toMatchObject(newSong);
      });

      it("DELETE /songs/:id should delete the song and return the deleted song", async () => {
        const deletedSong = { name: "Testing", artist: "Testing123"};
    
        const { body: actualSong } = await request(app) //destructing response object
        .delete("/songs/3")
        .expect(200)
    
        expect(actualSong).toMatchObject(deletedSong);
      });
      
  });
const request = require("supertest");
const app = require("./app");

// response is an object with text property (i.e. response = { text : ...})

describe("App", () => {
    it("GET / should respond with Welcome to my homepage", async () => {
      const {text} = await request(app).get("/").expect(200);
      expect(text).toBe("Hello World")  //toBe is lesser stricter than toEqual (toEqual compares type & content VS toBe compares content)
    });

    it('POST / should throw error when sending non-json content', async () => {
        const {text} = await request(app).post("/").send("non-json").expect(400);
        expect(text).toBe("Server wants application/json!")
    });

    it('POST / should be successful when sending json content', async () => {
        const {text} = await request(app).post("/").send({ name: "jeff" }).expect(201);
        expect(text).toBe("Thanks for the JSON!")
    });

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
        .send(newSong)
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
  
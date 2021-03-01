const request = require("supertest");
const app = require("./app");

// response is an object with text property (i.e. response = { text : ...})

describe.skip("App", () => {
    it("GET / should respond with Welcome to my homepage", async () => {
      const {text} = await request(app).get("/").expect(200);
      expect(text).toBe("Hello World")  //toBe is lesser stricter than toEqual (toEqual compares type & content VS toBe compares content)
    });

    it('POST / should throw error when sending non-json content', async () => {
        const {text} = await request(app).post("/").send("non-json").expect(400); //.send('non-json') means we are sending/posting a non-json object
        expect(text).toBe("Server wants application/json!")
    });

    it('POST / should be successful when sending json content', async () => {
        const {text} = await request(app).post("/").send({ name: "jeff" }).expect(201);
        expect(text).toBe("Thanks for the JSON!")
    });
      
  }); 
  
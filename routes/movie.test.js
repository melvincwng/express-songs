const request = require("supertest");
const app = require("../app");

describe('Movies', () => {
    it('POST /movies should return a new movie object', async () => {
        const movie = {
            "movieName": "Lion King"
          };
        const response = await request(app).post("/movies").send(movie).expect(201);
        expect(response.body).toMatchObject(movie)

    });

    it('GET /movies should return an array containing one movie object', async () => {
        const expectedMovieArray = [
            {
              "id": 1,
              "movieName": "Lion King"
            }
          ];
        const response = await request(app).get("/movies").expect(200);
        expect(response.body).toMatchObject(expectedMovieArray)

    });

    it('GET /movies/:id should return the movie with id', async () => {
        const expectedMovie = 
            {
              "id": 1,
              "movieName": "Lion King"
            };
        const response = await request(app).get("/movies/1").expect(200);
        expect(response.body).toMatchObject(expectedMovie)

    });

    it('PUT /movies/:id should return the updated movie', async () => {
        const updatedMovie = 
            {
                "movieName": "Frozen 2"
            }
        const expectedMovieResponse = {
            "id": 1,
            "movieName": "Frozen 2"
          }
        const response = await request(app).put("/movies/1").send(updatedMovie).expect(200);
        expect(response.body).toMatchObject(expectedMovieResponse)

    });

    it('DELETE /movies/:id should return the deleted movie', async () => {
        const deletedMovie = {
            "id": 1,
            "movieName": "Frozen 2"
          }
        const response = await request(app).delete("/movies/1").expect(200);
        expect(response.body).toMatchObject(deletedMovie);
    });

        it('GET /movies should return an empty array', async () => {

            const response = await request(app).get("/movies").expect(200);
            expect(response.body).toEqual([]);
        });

})
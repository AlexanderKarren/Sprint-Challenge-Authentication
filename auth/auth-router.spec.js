const request = require("supertest");

const server = require("../api/server.js");
const db = require("../database/dbConfig.js");

let testToken = "";

describe("auth-router", () => {
    describe("POST /register", () => {
        beforeEach(async () => {
            await db("users").truncate(); // empty the table and reset the id back to 1
        });
        
        it("return 201 on success", () => {
            return request(server)
                .post("/api/auth/register")
                .send({ username: "joe", password: "mama" })
                .then(res => {
                    expect(res.status).toBe(201);
                });
        });

        it("user should be added to the db after registering", async () => {
            const user = {
                username: "joe",
                password: "mama"
            }
      
            const existing = await db("users").where("username", user.username);
            expect(existing).toHaveLength(0);
      
            await request(server)
              .post("/api/auth/register")
              .send(user)
              .then(res => {
                expect(res.status).toBe(201)
              });
      
            const inserted = await db("users");
            expect(inserted).toHaveLength(1);
          });
    })

    describe("POST /login", () => {
        const user = {
            username: "joe",
            password: "mama"
        }

        it("should return status 200 when successful credentials are provided", async () => {
            await request(server)
            .post("/api/auth/login")
            .send(user)
            .then(res => {
                expect(res.status).toBe(200)
            })
        })

        it("should return token when successful credentials are provided", async () => {
            await request(server)
                .post("/api/auth/login")
                .send(user)
                .then(res => {
                    testToken = res.body.data.token;
                    expect(res.body.data.hasOwnProperty("token")).toBeTruthy();
                })
        })
    })

    describe("GET /jokes", () => {
        it("should return successful status code when legitamate token is provided", async () => {
            await request(server)
            .get("/api/jokes")
            .set("Authorization", testToken)
            .then(res => {
                expect(res.status).toBe(200);
            })
        })

        it("should return a list of jokes", async () => {
            await request(server)
            .get("/api/jokes")
            .set("Authorization", testToken)
            .then(res => {
                expect(res.body.length).not.toBeLessThan(1);
            })
        })
    })
})
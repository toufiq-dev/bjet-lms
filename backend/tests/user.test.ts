import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

describe("User Module", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 3000,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("userId");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      await request(app)
        .post("/api/users/register")
        .send({ username: "testuser2", password: "password123" });

      const response = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser2", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should not login with incorrect credentials", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser2", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});

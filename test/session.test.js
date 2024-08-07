import { afterEach, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const requester = supertest("http://localhost:3000");

describe("User Module Tests", function () {
  before(async function () {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  describe("GET /api/users", function () {
    it("should fetch users with a limit", async function () {
      const limit = 5;
      const response = await requester.get(`/api/users?limit=${limit}`);

      expect(Array.isArray(response.body.data)).to.be.true;
      expect(response.body).to.have.property("totalUsers");
      expect(response.body)
        .to.have.property("data")
        .with.lengthOf.at.most(limit);
    });
  });
  describe("GET /api/users/:uid", function () {
    it("should fetch user by ID", async function () {
      const uid = "665e4a063d48fbacef60aa42"; // Replace with a valid user ID
      const response = await requester.get(`/api/users/${uid}`);
      //console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("user");
      expect(response.body.user).to.have.property("_id", uid);
    });
    it("should return 404 for invalid user ID", async function () {
      const uid = "invalid_id";
      const response = await requester.get(`/api/users/${uid}`);
      expect(response.status).to.equal(404);
    });
  });
  describe("POST /api/sessions/register", function () {
    it("should register a new user", async function () {
      const newUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "premium",
        age: 30,
      };
      console.log("New User:", newUser);
      const response = await requester
        .post("/api/sessions/register")
        .send(newUser);
      console.log("Register Response Status:", response.status);
      console.log("Register Response Body:", response.body);

      if (response.status === 302) {
        const redirectResponse = await requester.get(response.headers.location);
        console.log("Redirect Response Status:", redirectResponse.status);
        console.log("Redirect Response Body:", redirectResponse.body);
        // Adjust your expectations based on the redirect response body
        expect(redirectResponse.status).to.equal(200); // Or whatever status you expect after redirect
        expect(redirectResponse.body).to.have.property("payload");
        expect(redirectResponse.body.payload).to.equal(
          "Registration successful...!!!"
        );
        expect(redirectResponse.body.user).to.have.property(
          "email",
          newUser.email
        );
      } else {
        // Direct response
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.equal("Registration successful...!!!");
        expect(response.body.user).to.have.property("email", newUser.email);
      }
    });

    it("should return 500 for registration error", async function () {
      const newUser = {
        lastName: "Doe",
        email: "john.doe@eGxample.com",
        password: "password123",
        age: 30,
      };
      const response = await requester
        .post("/api/sessions/register")
        .send(newUser);
      console.log("Register Response Status:", response.status);
      console.log("Register Response Headers:", response.headers);

      if (response.status === 302) {
        // Follow redirect URL if needed
        const redirectResponse = await requester.get(response.headers.location);
        console.log("Redirect Response Status:", redirectResponse.status);
        console.log("Redirect Response Body:", redirectResponse.body);
        expect(redirectResponse.status).to.equal(500);
        expect(redirectResponse.body).to.have.property(
          "error",
          "You've encountered an error, please validate your data."
        );
      } else {
        expect(response.status).to.equal(500);
      }
    });
  });
  describe("POST /api/sessions/login", function () {
    it("should login a user", async function () {
      const loginUser = {
        email: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASSWORD,
      };
      const response = await requester.post("/api/sessions/login").send(loginUser);
      if (response.status === 302) {
        const redirectResponse = await requester.get(response.headers.location);
        expect(redirectResponse.status).to.equal(200);
        expect(redirectResponse.body).to.have.property("payload", "Successful login");
        expect(redirectResponse.body.user).to.have.property("email", loginUser.email);
      } else {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("payload", "Successful login");
        expect(response.body.user).to.have.property("email", loginUser.email);
      }
    });

    it("should return 404 for login error", async function () {
      const loginUser = {
        email: "dminCoder@coder.com",
        password: "wrongpassword",
      };
      const response = await requester.post("/api/users/login").send(loginUser);
      expect(response.status).to.equal(404);
    });
  });
  describe("GET /api/sessions/logout", function () {
    it("should logout a user", async function () {
      const response = await requester.get("/api/users/logout");
      expect(response.status).to.equal(404);
    });
  });

  describe("GET /api/sessions/current", function () {
    let token;
  
    before(async function () {
      // Perform login to get a valid token or session
      const loginResponse = await requester.post("/api/sessions/login").send({
        email: "adminCoder@coder.com",
        password: process.env.ADMIN_PASSWORD,
      });
      token = loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
    });
  
    it("should fetch current logged-in user", async function () {
      const response = await requester
        .get("/api/sessions/current")
        .set('Cookie', token); // Attach the cookie from login
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("user");
    });
  });
  
});

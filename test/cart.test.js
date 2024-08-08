import { afterEach, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const requester = supertest("http://localhost:3000");
let premiumToken;
let testCartId;
const testProductId = "663812380163b5b5f6ad5101";

describe("Cart API Tests", function () {
  // Connect to the database before running the tests
  before(async function () {
    await mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME });
  });

  // Disconnect from the database after running the tests
  after(async function () {
    await mongoose.disconnect();
  });

  describe("POST /api/carts", function () {
    it("should create a new cart", async function () {
      const response = await requester.post("/api/carts").expect(201);
      expect(response.body).to.have.property("cart");
      testCartId = response.body.cart._id;
    });
  });

  describe("GET /api/carts/:cid", function () {
    it("should get a cart by ID", async function () {
      const response = await requester
        .get(`/api/carts/${testCartId}`)
        .expect(200);
      expect(response.body).to.have.property("cart");
    });

    it("should return 404 for non-existent cart", async function () {
      await requester.get("/api/carts/invalidid").expect(404);
    });
  });

  describe("POST /api/carts/:cid/product/:pid", function () {
    before(async function () {
      // Log in as premium
      const loginResponse = await requester.post("/api/sessions/login").send({
        email: process.env.PREMIUM_USER,
        password: process.env.PREMIUM_PASSWORD,
      });

      premiumToken = loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
    });

    it("should add a product to the cart", async function () {
      console.log(`cid:`, testCartId);
      console.log(`pid2:`, testProductId);
      
      const response = await requester
        .post(`/api/carts/${testCartId}/product/${testProductId}`)
        .set('Cookie', premiumToken)
        .expect(201);
        
      expect(response.body).to.have.property("cart");
    });
  });

  /*
  describe("PUT /api/carts/:cid", function() {
    it("should update the cart", async function() {
      const response = await requester.put(`/api/carts/${testCartId}`).send({
        products: [
          { productId: testProductId, quantity: 5 }
        ]
      }).expect(200);
      expect(response.body).to.have.property("message").that.equals("Cart updated successfully");
    });
  });

  describe("PUT /api/carts/:cid/product/:pid", function() {
    it("should update the quantity of a product in the cart", async function() {
      const response = await requester.put(`/api/carts/${testCartId}/product/${testProductId}`).send({
        quantity: 10
      }).expect(200);
      expect(response.body).to.have.property("cart");
    });
  });

  describe("GET /api/carts/:cid/purchase", function() {
    it("should handle cart purchase", async function() {
      // Simulate a user with appropriate authentication and data
      const response = await requester.get(`/api/carts/${testCartId}/purchase`)
        .set('Authorization', 'Bearer your-auth-token')
        .expect(200);
      expect(response.body).to.have.property("status");
    });
  }
  
  describe("DELETE /api/carts/:cid/product/:pid", function() {
    it("should remove a product from the cart", async function() {
      const response = await requester.delete(`/api/carts/${testCartId}/product/${testProductId}`).expect(200);
      expect(response.body).to.have.property("cart");
    });

    it("should return 404 for non-existent product in the cart", async function() {
      await requester.delete(`/api/carts/${testCartId}/product/invalidid`).expect(404);
    });
  });

  describe("DELETE /api/carts/:cid", function() {
    it("should delete all products from the cart", async function() {
      const response = await requester.delete(`/api/carts/${testCartId}`).expect(200);
      expect(response.body).to.have.property("cart");
    });
  }
  */
});

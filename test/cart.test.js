import { afterEach, before, describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const requester = supertest("http://localhost:3000");

describe("Product Module Tests", function () {
  let adminToken;
  let productId;

  before(async function () {
    // Connect to the database
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log in as admin
    const loginResponse = await requester.post("/api/sessions/login").send({
      email: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASSWORD,
    });

    adminToken = loginResponse.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
  });

  after(async function () {
    // Close database connection
    await mongoose.connection.close();
  });

  describe("GET /api/products", function () {
    it("should get all products", async function () {
      const response = await requester
        .get("/api/products")
        .set('Cookie', adminToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('totalProducts');
      expect(response.body).to.have.property('data').that.is.an('array');
    });
  });

  describe("POST /api/products", function () {
    it("should add a new product", async function () {
      const newProduct = {
        title: "Key TestFile",
        owner: "premiumcoder@gmail.com",
        description: "Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality",
        code: "A030",
        price: 30,
        discountPercentage: 2.92,
        rating: 4.92,
        status: true,
        stock: 54,
        brand: "Golden",
        category: "home-decoration",
        thumbnail: "https://cdn.dummyjson.com/product-images/30/thumbnail.jpg",
        images: [
          "https://cdn.dummyjson.com/product-images/30/1.jpg",
          "https://cdn.dummyjson.com/product-images/30/2.jpg",
          "https://cdn.dummyjson.com/product-images/30/3.jpg",
          "https://cdn.dummyjson.com/product-images/30/thumbnail.jpg"
        ]
      };
  
      const response = await requester
        .post("/api/products")
        .set('Cookie', adminToken)
        .send(newProduct);
  
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('_id'); // Assuming the response directly contains the product data
      productId = response.body._id; // Store productId for later tests
      console.log(productId);
    });
  });

  describe("GET /api/products/:pid", function () {
    it("should get a product by ID", async function () {
      const response = await requester
        .get(`/api/products/${productId}`)
        .set('Cookie', adminToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('product');
      expect(response.body.product._id).to.equal(productId);
    });
  });

  describe("PUT /api/products/:pid", function () {
    it("should update a product by ID", async function () {
      const updatedProduct = {
        price: 150,
      };

      const response = await requester
        .put(`/api/products/${productId}`)
        .set('Cookie', adminToken)
        .send(updatedProduct);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('uproduct');
      expect(response.body.uproduct.price).to.equal(150);
    });
  });

  describe("DELETE /api/products/:pid", function () {
    it("should delete a product by ID", async function () {
      const response = await requester
        .delete(`/api/products/${productId}`)
        .set('Cookie', adminToken);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id').that.equals(productId);
    });
  });

});

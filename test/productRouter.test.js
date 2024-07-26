const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app"); // Ensure this path is correct

const { expect } = chai;
chai.use(chaiHttp);

describe("Product Routes", () => {
  it("should return 50 mocked products", (done) => {
    chai.request(app)
      .get("/mockingproducts")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array").that.has.lengthOf(50);
        done();
      });
  });

  it("should create a product with valid data", (done) => {
    chai.request(app)
      .post("/api/products")
      .send({
        title: "Valid Product",
        price: 29.99,
        description: "A valid product description",
        code: "VP123",
        stock: 10,
        category: "Electronics"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        done();
      });
  });

  it("should return an error for missing title", (done) => {
    chai.request(app)
      .post("/api/products")
      .send({
        price: 29.99,
        description: "A product without a title",
        code: "VP123",
        stock: 10,
        category: "Electronics"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error").that.equals("Title is required");
        done();
      });
  });

  it("should return an error for missing price", (done) => {
    chai.request(app)
      .post("/api/products")
      .send({
        title: "Product Without Price",
        description: "A product without a price",
        code: "VP123",
        stock: 10,
        category: "Electronics"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error").that.equals("Price is required");
        done();
      });
  });
});
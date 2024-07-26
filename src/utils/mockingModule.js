import { faker } from '@faker-js/faker';

const generateMockProducts = (count = 100) => {
  const products = [];
  try {
    for (let i = 0; i < count; i++) {
      products.push({
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: `${faker.word.sample().toUpperCase()}-${faker.commerce.productName()}`,
        price: parseFloat(faker.commerce.price()),
        discountPercentage: faker.number.float(3),
        rating: faker.number.float({ min: 0, max: 5 }),
        status: faker.datatype.boolean(),
        stock: faker.number.float({ min: 0, max: 100 }),
        brand: faker.word.adjective(),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()],
        images: [faker.image.url(), faker.image.url()]
      });
    }
  } catch (error) {
    console.error("Error generating mock products:", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
  return products;
};


const mockProducts = (req, res) => {
  try {
    const products = generateMockProducts(100);
    console.log("Generated products:", products); // Log generated products for verification
    res.status(200).json({ message: "Mock products generated successfully", products });
  } catch (error) {
    console.error("Error generating mock products:", error);
    res.status(500).json({ error: "Error generating mock products" });
  }
};

export { mockProducts };
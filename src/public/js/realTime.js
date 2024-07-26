const socket = io();
socket.on("products", (products) => {
  console.log(products);
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = ""; // Clear previous content

  products.forEach((product) => {
    // Create product container
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    // Create product image container
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("product-image");
    let image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    imageDiv.appendChild(image);

    // Create product details container
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("product-details");
    detailsDiv.innerHTML = `
            <div class="product-title">${product.title}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-code">Product Code: ${product.code}</div>
            <div class="product-price">Price: $${product.price}</div>
            <div class="product-discount">Discount: ${product.discountPercentage}%</div>
            <div class="product-rating">Rating: ${product.rating}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
            <div class="product-brand">Brand: ${product.brand}</div>
            <div class="product-category">Category: ${product.category}</div>
        `;

    // Append image and details to product container
    productDiv.appendChild(imageDiv);
    productDiv.appendChild(detailsDiv);

    // Append product container to products container
    productsContainer.appendChild(productDiv);
  });
});
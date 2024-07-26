class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorDictionary = {
  PRODUCT_CREATION: {
    MISSING_TITLE: "Title is required",
    MISSING_PRICE: "Price is required",
    INVALID_PRICE: "Price must be a number",
  },
  CART: {
    MISSING_PRODUCT_ID: "Product ID is required",
    INVALID_QUANTITY: "Quantity must be a positive number",
  }
};

const handleCustomError = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({ error: err.message });
  } else {
    next(err);
  }
};

export { CustomError, errorDictionary, handleCustomError };
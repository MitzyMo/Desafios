const express = require("express");
const productRouter = require("./routes/productsRouter"); 

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {   
    response.json("Landing Page");
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ Status: "Ok" });
});
app.use("/api/products", productRouter);

app.listen(PORT, error => {
    if (error) {
        console.error('Failed to start the server:', error);
        return;
    }
    console.log(`Server connected in port ${PORT}`);
});
import express from "express";
const router = express.Router();

router.get("/", (request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.status(200).render('home',{});
});

router.get("/realtimeproducts", (request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.status(200).render('realTimeProducts',{});

});


export default router;
import { Router } from "express";

const products = Router();

products.get("/products", (req, res) => {
  res.send("Products page");
});

export default products;
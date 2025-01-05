const express = require('express');
const { createAOrder, getOrderByEmail, deleteOrder } = require('./order.controller');

const router =  express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email 
router.get("/email/:email", getOrderByEmail);

// delete order endpoint
router.delete("/:id", deleteOrder);

module.exports = router;
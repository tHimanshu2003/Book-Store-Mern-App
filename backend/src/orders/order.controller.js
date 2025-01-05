const Order = require("./order.model");

const createAOrder = async (req, res) => {
  try {
    const newOrder =  await Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrderByEmail = async (req, res) => {
  try {
    const {email} = req.params;
    const orders = await Order.find({email}).sort({createdAt: -1});
    if(!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

const deleteOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if(!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
}



module.exports = {
  createAOrder,
  getOrderByEmail,
  deleteOrder
};

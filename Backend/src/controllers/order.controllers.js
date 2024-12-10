import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.models.js";


const createOrder = asyncHandler(async (req, res) => {
    const { customer, area, items, totalAmount, scheduledFor, assignedTo } = req.body;
    
    if (!customer || !area || !items || !totalAmount || !scheduledFor) {
      throw new ApiError(400, "All fields are required.");
    }

    // Initialize the delivery partner ID as null
    let deliveryPartnerId = null;

    // Check if `assignedTo` (name) is provided
    if (assignedTo) {
      const partner = await DeliveryPartner.findOne({ name: assignedTo }); // Replace `Partner` with your delivery partner model
      if (!partner) {
        throw new ApiError(404, `Delivery partner with name "${assignedTo}" not found.`);
      }
      deliveryPartnerId = partner._id;
    }
    
    const order = await Order.create({
      customer,
      area,
      items,
      totalAmount,
      scheduledFor,
      assignedTo: deliveryPartnerId || null,
      status: 'pending',
    });
  
  
    return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully."));
});


const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('assignedTo', 'name email phone');
  
    if (orders.length === 0) {
      throw new ApiError(404, "No orders found.");
    }
  
    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully."));
});
  


export { 
    createOrder,
    getAllOrders,
};
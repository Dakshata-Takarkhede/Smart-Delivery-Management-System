import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DeliveryPartner } from "../models/deliveryPartner.models.js";
import { Order } from "../models/order.models.js";


const createPartner = asyncHandler(async (req, res) => {
    const { name, email, phone, areas, shift, status } = req.body;
  
    if ([name, email, phone].some(field => field?.trim() === "")) {
      throw new ApiError(400, "Name, email, and phone are required.");
    }
  
    // Check if user already exists
    const partnerExists = await DeliveryPartner.findOne({ email });
    if (partnerExists) {
      throw new ApiError(400, "Delivery partner already exists.");
    }
  
    const partner = await DeliveryPartner.create({
        name,
        email,
        phone,
        areas,
        shift,
        status,
        owner: req.user._id,
    })

  
    return res
    .status(201)
    .json(new ApiResponse(201, partner, "Partner created successfully."));
});
  

const getAllPartners = asyncHandler(async (req, res) => {
    const partners = await DeliveryPartner.find();
  
    if (partners.length === 0) {
      throw new ApiError(404, "No partners found.");
    }
  
    return res
    .status(200)
    .json(new ApiResponse(200, partners, "Partners retrieved successfully."));
});


const updatePartner = asyncHandler(async (req, res) => {
    const { partnerId } = req.params;
    const { name, email, phone, areas, shift, status } = req.body;
  
    const partner = await DeliveryPartner.findByIdAndUpdate(
        partnerId, 
        {
            $set: {
                name, 
                email,
                phone,
                shift,
                areas,
                status,
            },
        },
        { new: true }
    );
  
    if (!partner) {
      throw new ApiError(404, "Partner not found.");
    }
  
    return res
    .status(200)
    .json(new ApiResponse(200, partner, "Partner updated successfully."));
});


const deletePartner = asyncHandler(async (req, res) => {
    const { partnerId } = req.params;
  
    const partner = await DeliveryPartner.findByIdAndDelete(partnerId);
  
    if (!partner) {
      throw new ApiError(404, "Partner not found.");
    }
  
    return res
    .status(200)
    .json(new ApiResponse(200, null, "Partner deleted successfully."));
});


const updatePartnerMetrics = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  // Find the order by ID
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // console.log(order);

  // Find the delivery partner assigned to the order
  const partner = await DeliveryPartner.findById(order.assignedTo);
  if (!partner) {
    throw new ApiError(404, "Partner not found.");
  }

  // Update metrics based on order status
  if (order.status === "delivered") {
    // Increment completed orders count
    partner.metrics.completedOrders += 1;
  } else if (order.status === "canceled") {
    // Increment canceled orders count
    partner.metrics.cancelledOrders += 1;
  }


  // Save the updated metrics
  await partner.save();

  return res
  .status(200)
  .json(new ApiResponse(200, partner, "Partner metrics updated successfully."));
});


export { 
    createPartner,
    getAllPartners,
    updatePartner,
    deletePartner,
    updatePartnerMetrics,
};
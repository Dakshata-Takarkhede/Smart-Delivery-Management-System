import { asyncHandler } from "../utils/asyncHandler.js";
import { Assignment } from "../models/assignment.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.models.js"
import { Order } from "../models/order.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const getDashboardMetrics = asyncHandler(async (req, res) => {
    // 1. Total and Active Delivery Partners
    const totalPartners = await DeliveryPartner.countDocuments();
    const activePartners = await DeliveryPartner.countDocuments({ status: "active" });

    // 2. Total Active Orders
    const activeOrders = await Order.countDocuments({ status: { $in: ["pending", "assigned", "picked"] } });

    // 4. Pending Orders
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // 5. Completed Orders
    const completedOrders = await Order.countDocuments({ status: "delivered" });

    // Compile the data into an object
    const metrics = {
        totalPartners,
        activePartners,
        activeOrders,
        pendingOrders,
        completedOrders,
    };

    return res
    .status(200)
    .json(new ApiResponse(200, metrics, "Dashboard metrics retrieved successfully"))
});


export {
    getDashboardMetrics
}
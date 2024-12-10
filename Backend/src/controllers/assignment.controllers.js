import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Assignment } from "../models/assignment.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.models.js"
import { Order } from "../models/order.models.js"


const assignOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { partnerName } = req.body;

  // 1. Validate the existence of the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // 2. Validate the existence of the partner. Find the partner by name (instead of partnerId)
  const partner = await DeliveryPartner.findOne({ name: partnerName });
  if (!partner) {
    throw new ApiError(404, "Delivery partner not found.");
  }

  // 3. Check if the partner's shift allows them to take the order at the scheduled time
  const orderScheduledTime = new Date(order.scheduledFor); // Ensure scheduledFor is a Date object

  const partnerShiftStart = new Date(`1970-01-01T${partner.shift.start}:00`);
  const partnerShiftEnd = new Date(`1970-01-01T${partner.shift.end}:00`);

  if (orderScheduledTime < partnerShiftStart || orderScheduledTime > partnerShiftEnd) {
    throw new ApiError(400, "Partner's shift does not cover the order's scheduled time.");
  }

  // 4. Check if the partner's current load is less than the maximum allowed
  if (partner.currentLoad >= 3) {
    throw new ApiError(400, "Partner has reached their maximum load.");
  }

  // 5. Check if the partner operates in the order's area
  if (!partner.areas.includes(order.area)) {
    throw new ApiError(400, "Partner does not operate in the order's area.");
  }


  const assignment = await Assignment.create({
    orderId,
    partnerId: partner._id,
    status: "success",
    timestamp: new Date(),
  });


  // Update order status
  await Order.findByIdAndUpdate(
    orderId, 
    { 
        $set: {
            assignedTo: partner._id, 
            status: 'assigned'
        }, 
    },
    { new : true }  
  );

  partner.currentLoad += 1;
  await partner.save();

  return res
  .status(201)
  .json(new ApiResponse(201, assignment, "Order assigned successfully."));
});


const getAssignmentMetrics = asyncHandler(async (req, res) => {
    // 1. Get total assignments and success count
    const totalAssignments = await Assignment.countDocuments();
    const successCount = await Assignment.countDocuments({ status: "success" });
    const failureCount = await Assignment.countDocuments({ status: "failed" });
  
    // 2. Calculate success rate
    const successRate = totalAssignments ? (successCount / totalAssignments) * 100 : 0;
  
    // 3. Calculate average assignment time for successful assignments
    const successfulAssignments = await Assignment.find({ status: "success" })
      .populate("orderId")  // Assuming each assignment has an associated order
      .exec();
  
    let totalTime = 0;
    successfulAssignments.forEach((assignment) => {
      const orderCreationTime = new Date(assignment.orderId.createdAt).getTime();
      const assignmentTime = new Date(assignment.timestamp).getTime();
      totalTime += assignmentTime - orderCreationTime;  // Time difference in milliseconds
    });
  
    const averageTime = successfulAssignments.length > 0 ? totalTime / successfulAssignments.length / 60000 : 0;  // Convert to minutes
  
    // 4. Calculate failure reasons
    const failureReasons = await Assignment.aggregate([
      { $match: { status: "failed" } },
      { $group: { _id: "$reason", count: { $sum: 1 } } },
    ]);
  
    // Format the response data
    const metrics = {
      totalAssignments,
      successRate,
      averageTime: averageTime.toFixed(2), // Round to 2 decimal places
      failureReasons: failureReasons.map((reason) => ({
        reason: reason._id,
        count: reason.count,
      })),
    };
  
    return res
    .status(200)
    .json(new ApiResponse(200, metrics, "Assignment metrics retrieved successfully."));
});


const failAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { reason } = req.body; // Failure reason provided by the admin or system

  // Validate the provided reason
  if (!reason || reason.trim() === "") {
    throw new ApiError(400, "Failure reason is required.");
  }

  // Find the assignment by ID
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  // Find the associated delivery partner
  const partner = await DeliveryPartner.findById(assignment.partnerId);
  if (!partner) {
    throw new ApiError(404, "Delivery partner not found.");
  }

  // Update the assignment status to 'failed' and store the reason
  assignment.status = "failed";
  assignment.reason = reason; // Add the reason for failure
  await assignment.save();

  // Decrease the partner's current load
  partner.currentLoad -= 1;

  // Increment the canceled orders count in the partner's metrics
  partner.metrics.cancelledOrders += 1;

  // Save the updated partner metrics
  await partner.save();

  return res
  .status(200)
  .json(new ApiResponse(200, assignment, "Assignment marked as failed successfully."));
});


export { 
    assignOrder, 
    getAssignmentMetrics,
    failAssignment,
};
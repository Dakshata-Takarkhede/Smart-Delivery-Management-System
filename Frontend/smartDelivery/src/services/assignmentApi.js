import api from "./api.js";

// Assign an order to a partner
export const assignOrder = (orderId, partnerName) => api.post(`/assignments/${orderId}`, { partnerName });

// Get assignment metrics
export const fetchAssignmentMetrics = () => api.get("/assignments/assignment-metrics");

// Get assignment data
export const fetchAssignments = () => api.get("assignments/");
  
// Mark an assignment as failed
export const failAssignment = (assignmentId, reason) => api.patch(`/assignments/fail/${assignmentId}`, reason );


import api from "./api.js";

// Assign an order to a partner
export const assignOrder = (orderId, partnerName) => api.post(`/api/v1/assignments/${orderId}`, { partnerName });

// Get assignment metrics
export const fetchAssignmentMetrics = () => api.get("/api/v1/assignments/assignment-metrics");

// Get assignment data
export const fetchAssignments = () => api.get("/api/v1/assignments/");
  
// Mark an assignment as failed
export const failAssignment = (assignmentId, reason) => api.patch(`/api/v1/assignments/fail/${assignmentId}`, reason );


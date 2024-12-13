import api from "./api.js";

// Fetch dashboard metrics
export const fetchDashboardMetrics = () => api.get("/api/v1/dashboard/");

import api from "./api.js";

// Fetch dashboard metrics
export const fetchDashboardMetrics = () => api.get("/dashboard/");

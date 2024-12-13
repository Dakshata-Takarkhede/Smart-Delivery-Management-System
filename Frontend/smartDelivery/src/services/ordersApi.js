import api from "./api.js";

// Fetch all orders
export const fetchOrders = () => api.get("/api/v1/orders/");

// Create a new order
export const createOrder = (orderData) => api.post("/api/v1/orders/assign", orderData);

// Update an order
// export const updateOrder = (orderId, updatedData) => api.put(`/api/v1/orders/${orderId}`, updatedData);

// Delete an order
// export const deleteOrder = (orderId) => api.delete(`/api/v1/orders/${orderId}`);

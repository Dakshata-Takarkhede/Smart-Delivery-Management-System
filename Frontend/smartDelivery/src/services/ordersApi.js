import api from "./api.js";

// Fetch all orders
export const fetchOrders = () => api.get("/orders/");

// Create a new order
export const createOrder = (orderData) => api.post("/orders/assign", orderData);

// Update an order
// export const updateOrder = (orderId, updatedData) => api.put(`/orders/${orderId}`, updatedData);

// Delete an order
// export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);

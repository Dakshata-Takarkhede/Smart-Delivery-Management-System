import api from "./api.js";

// Fetch all partners
export const fetchPartners = () => api.get("/api/v1/partners/");

// Create a new partner
export const createPartner = (partnerData) => api.post("/api/v1/partners/", partnerData);

// Update a partner
export const updatePartner = (partnerId, updatedData) => api.patch(`/api/v1/partners/${partnerId}`, updatedData);
  
// Delete a partner
export const deletePartner = (partnerId) => api.delete(`/api/v1/partners/${partnerId}`);

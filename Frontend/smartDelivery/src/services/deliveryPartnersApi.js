import api from "./api.js";

// Fetch all partners
export const fetchPartners = () => api.get("/partners/");

// Create a new partner
export const createPartner = (partnerData) => api.post("/partners/", partnerData);

// Update a partner
export const updatePartner = (partnerId, updatedData) => api.patch(`/partners/${partnerId}`, updatedData);
  
// Delete a partner
export const deletePartner = (partnerId) => api.delete(`/partners/${partnerId}`);
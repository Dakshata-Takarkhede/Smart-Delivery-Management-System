import api from "./api.js";

// Register a new user with avatar upload
export const registerUser = (formData) => api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
});

// Log in a user
export const loginUser = (credentials) => api.post("/users/login", credentials);

// Log out the current user
export const logoutUser = () => api.post("/users/logout");

// Refresh the access token
export const refreshAccessToken = () => api.post("/users/refresh-token");

// Change the current user's password
export const changePassword = (passwordData) => api.post("/users/change-password", passwordData);

// Get the details of the current user
export const getCurrentUser = () => api.get("/users/current-user");

// Update account details of the current user
export const updateAccountDetails = (accountData) => api.patch("/users/update-account", accountData);

// Update the avatar of the current user
export const updateUserAvatar = (formData) => api.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
});

// Get all users
export const getAllUsers = () => api.get("/users");
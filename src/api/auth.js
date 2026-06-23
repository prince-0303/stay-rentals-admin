import axiosInstance from "./axiosInstance";

export const loginAdmin = (credentials) =>
    axiosInstance.post("/api/auth/login/", credentials);

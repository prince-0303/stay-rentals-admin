import axiosInstance from "./axiosInstance";

export const getEarningsStats = () => axiosInstance.get("/api/admin/earnings/");
export const getListerEarningsDetail = (listerId) => axiosInstance.get(`/api/admin/earnings/${listerId}/`);

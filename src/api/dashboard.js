import axiosInstance from "./axiosInstance";

export const getDashboardStats = () =>
    axiosInstance.get("/api/admin/stats/");

export const getChartData = () =>
    axiosInstance.get("/api/admin/charts/");

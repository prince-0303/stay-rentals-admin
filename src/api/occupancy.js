import axiosInstance from "./axiosInstance";

/**
 * Fetches occupancy data for either 'properties' or 'users' view.
 * @param {string} view - 'properties' or 'users'
 */
export const getOccupancyData = (view = "properties") =>
    axiosInstance.get("/api/admin/occupancy/", { params: { view } });

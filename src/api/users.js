import axiosInstance from "./axiosInstance";

// ── USERS ──────────────────────────────────────────────────────
export const getUsers = (params) =>
    axiosInstance.get("/api/admin/users/", { params });

export const getUserById = (id) =>
    axiosInstance.get(`/api/admin/users/${id}/`);

export const updateUser = (id, data) =>
    axiosInstance.patch(`/api/admin/users/${id}/`, data);

export const deleteUser = (id) =>
    axiosInstance.delete(`/api/admin/users/${id}/`);

export const blockUser = (id, reason) =>
    axiosInstance.patch(`/api/admin/users/${id}/block/`, { action: "block", reason });

export const unblockUser = (id) =>
    axiosInstance.patch(`/api/admin/users/${id}/block/`, { action: "unblock" });

// ── LISTERS ────────────────────────────────────────────────────
export const getListers = (params) =>
    axiosInstance.get("/api/admin/listers/", { params });

export const getListerById = (id) =>
    axiosInstance.get(`/api/admin/listers/${id}/`);

export const updateLister = (id, data) =>
    axiosInstance.patch(`/api/admin/listers/${id}/`, data);

export const deleteLister = (id) =>
    axiosInstance.delete(`/api/admin/listers/${id}/`);

export const blockLister = (id, reason) =>
    axiosInstance.patch(`/api/admin/listers/${id}/block/`, { action: "block", reason });

export const unblockLister = (id) =>
    axiosInstance.patch(`/api/admin/listers/${id}/block/`, { action: "unblock" });

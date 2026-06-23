import axiosInstance from "./axiosInstance";

export const getAllKYC = (params) =>
    axiosInstance.get("/api/admin/kyc/", { params });

export const getKYCById = (id) =>
    axiosInstance.get(`/api/admin/kyc/${id}/`);

export const approveKYC = (id) =>
    axiosInstance.post(`/api/admin/kyc/${id}/`, { action: "approve" });

export const rejectKYC = (id, reason) =>
    axiosInstance.post(`/api/admin/kyc/${id}/`, { action: "reject", reason });

export const getPendingKYCCount = async () => {
    const res = await axiosInstance.get("/api/admin/kyc/", { params: { status: "pending" } });
    const count = res.data?.count || 0;
    return { data: { count } };
};

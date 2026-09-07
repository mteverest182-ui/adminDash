import axios from "./axios";

export const getBanners = async (params = {}) => {
    const response = await axios.get("/api/banners", {
        params,
    });

    return response.data;
};

export const getBannerById = async (id) => {
    const response = await axios.get(`/api/banners/${id}`);

    return response.data;
};

export const createBanner = async (data) => {
    const response = await axios.post("/api/banners", data);

    return response.data;
};

export const updateBanner = async (id, data) => {
    const response = await axios.put(`/api/banners/${id}`, data);

    return response.data;
};

export const deleteBanner = async (id) => {
    const response = await axios.delete(`/api/banners/${id}`);

    return response.data;
};

export const updateBannerStatus = async (id, status) => {
    const response = await axios.patch(`/api/banners/${id}/status`, {
        status,
    });

    return response.data;
};
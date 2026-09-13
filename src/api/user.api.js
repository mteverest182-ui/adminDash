import api from "./axios";

export const getUsers = async () => {
    const response = await api.get("/api/users");

    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post("/api/users", data);

    return response.data;
};

export const updateAdmin = async (id, data) => {
   const response = await api.patch(`/api/users/roles/${id}`, data);
    return response.data;
};

export const deleteAdmin = async(id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
}


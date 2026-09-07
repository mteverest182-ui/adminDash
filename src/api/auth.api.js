import api from "./axios";

export const login = async (data) => {
  const response = await api.post("/api/auth/signin", data);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/api/auth/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/user");

  return response.data;
};

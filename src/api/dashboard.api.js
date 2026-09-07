import api from "./axios.js"

export const getDashboardData = async () => {
    const response = await api.get("/api/dashboard/");

    return response.data;
}

export const getWhatsappSetting = async() => {
    const response = await api.get("/api/dashboard/whatsapp")

    return response.data;
}

export const updateWhatsappSetting = async (whatsappUrl) => {
  const response = await api.put(
    "/api/dashboard/whatsapp",
    {
      whatsappUrl,
    }
  );

  return response.data;
};

export const deleteWhatsappSetting = async () => {
  const response = await api.delete(
    "/api/dashboard/whatsapp"
  );

  return response.data;
};
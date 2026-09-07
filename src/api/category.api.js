import api from "./axios";

export const getCategories = async () => {
  const response = await api.get("/api/categories");

  return response.data;
};

export const getCategoriesById = async (id) => {
  const response = await api.get(`/api/categories/${id}`);

  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/api/categories", data);

  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(
    `/api/categories/${id}`,
    data
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/api/categories/${id}`
  );

  return response.data;
};

export const getCategoryProducts = async (
  categoryId,
  page = 1,
  limit = 8
) => {
  const response = await api.get(
    `/api/categories/${categoryId}/products`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};
import api from "./axios";

export const getProducts = async (
  page = 1,
  limit = 8,
  search = "",
  gender = "",
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search) {
    params.append("search", search);
  }

  if (gender) {
    params.append("gender", gender);
  }

  const url = `/api/products?${params.toString()}`;

  const response = await api.get(url);

  return response.data;
};


export const getCategoryProducts = async (
  categoryId,
  page = 1,
  limit = 8,
) => {
  if (!categoryId) {
    throw new Error(
      "categoryId wajib diisi",
    );
  }

  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  const url =
    `/api/categories/${categoryId}/products?${params.toString()}`;

  const response = await api.get(url);

  return response.data;
};


export const createProduct = async (
  formData,
) => {
  const response = await api.post(
    "/api/products",
    formData,
  );

  return response.data;
};


export const getProductById = async (
  id,
) => {
  const response = await api.get(
    `/api/products/${id}`,
  );

  return response.data;
};


export const editProduct = async (
  id,
  formData,
) => {
  const response = await api.put(
    `/api/products/${id}`,
    formData,
  );

  return response.data;
};

export const deleteProducts = async (
  id,
) => {
  const response = await api.delete(
    `/api/products/${id}`,
  );

  return response.data;
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { createProduct } from "../../api/product.api";

const ProductCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async ({ form, image }) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("brand", form.brand.trim());
      formData.append("gender", form.gender);
      formData.append("categoryId", form.categoryId);
      formData.append("price", form.price);
      formData.append("discountPercent", form.discountPercent ?? 0)
      formData.append("stock", form.stock);
      formData.append("image", image);
      await createProduct(formData);

      navigate("/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      setError(error.response?.data?.message || "Gagal membuat product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tambah Product</h1>

          <p className="mt-1 text-base-content/70">
            Tambahkan Product baru ke dalam katalog.
          </p>
        </div>

        {/* Server Error */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <ProductForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;

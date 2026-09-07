import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProductById, editProduct } from "../../api/product.api";

import ProductForm from "./ProductForm";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductById(id);

        console.log("GET PRODUCT DETAIL:", response);

        setProduct(response.data ?? response);
      } catch (error) {
        console.error("GET PRODUCT DETAIL ERROR:", error);

        setError(
          error.response?.data?.message || "Gagal mengambil data product",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async ({ form, image }) => {
    try {
      setSubmitLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", form.name.trim());

      formData.append("brand", form.brand.trim());

      formData.append("gender", form.gender);

      formData.append("price", form.price);

      formData.append("discount", form.discountPercent)

      formData.append("stock", form.stock);

      // Hanya kirim image jika user
      // memilih gambar baru
      if (image) {
        formData.append("image", image);
      }

      console.log("UPDATE PRODUCT:");

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await editProduct(id, formData);

      navigate("/Products");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      setError(error.response?.data?.message || "Gagal memperbarui product");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <div className="skeleton h-9 w-52" />
            <div className="skeleton mt-3 h-5 w-80" />
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body space-y-6">
              <div>
                <div className="skeleton mb-2 h-4 w-32" />
                <div className="skeleton h-12 w-full" />
              </div>

              <div>
                <div className="skeleton mb-2 h-4 w-20" />
                <div className="skeleton h-12 w-full" />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <div className="skeleton mb-2 h-4 w-20" />
                  <div className="skeleton h-12 w-full" />
                </div>

                <div>
                  <div className="skeleton mb-2 h-4 w-20" />
                  <div className="skeleton h-12 w-full" />
                </div>
              </div>

              <div>
                <div className="skeleton mb-2 h-4 w-32" />
                <div className="skeleton h-12 w-full" />
              </div>

              <div className="skeleton h-72 w-full rounded-xl" />

              <div className="flex justify-end gap-3 pt-4">
                <div className="skeleton h-12 w-24" />
                <div className="skeleton h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-5xl">📦</div>

              <h2 className="text-xl font-bold">Product Tidak Ditemukan</h2>

              <p className="text-base-content/60">
                Product yang ingin kamu edit tidak tersedia.
              </p>

              {error && (
                <div className="alert alert-error mt-5 w-full">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                className="btn mt-5"
                onClick={() => navigate("/Products")}
              >
                Kembali ke Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn btn-circle btn-ghost"
              onClick={() => navigate("/Products")}
              disabled={submitLoading}
            >
              ←
            </button>

            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>

              <p className="mt-1 text-base-content/70">
                Perbarui informasi product
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              loading={submitLoading}
              submitText="Simpan Perubahan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;

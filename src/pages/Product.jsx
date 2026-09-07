import { useState } from "react";

import ProductHeader from "../includes/product/ProductHeader";
import ProductSearch from "../includes/product/ProductSearch";
import ProductTable from "../includes/product/ProductTable";
import ProductDeleteModal from "../includes/product/ProductDeleteModal";

import useProducts from "../includes/product/useProducts";

const Product = () => {
  const {
    products,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMoreRef,
    search,
    handleSearch,
    handleDeleteProduct,
    setError,
  } = useProducts();

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
  };

  const handleCloseDelete = () => {
    if (deleteLoading) return;

    setDeletingProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleteLoading(true);
      setError("");

      await handleDeleteProduct(deletingProduct.id);

      setDeletingProduct(null);
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setError(
        error.response?.data?.message || "Gagal menghapus product",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 px-5 py-8 md:px-8 md:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <section className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-primary">
              Collection
            </p>

            <h1 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">
              All Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-base-content/50">
              Kelola seluruh product yang tersedia di toko.
            </p>
          </div>
                   <ProductHeader />
        </section>

                      <ProductSearch
              value={search}
              onChange={handleSearch}
            />

        {/* ERROR */}
        {!loading && error && (
          <div className="mb-5 rounded-2xl border border-error/20 bg-error/5 px-5 py-4 text-sm text-error">
            {error}
          </div>
        )}

        {/* PRODUCT CONTENT */}
        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {/* LOADING */}
          {loading && (
            <div className="flex min-h-60 items-center justify-center">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          )}

          {/* CONTENT */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <>
                  {/* TABLE */}
                  <ProductTable
                    products={products}
                    loadMoreRef={loadMoreRef}
                    loadingMore={loadingMore}
                    hasNextPage={hasNextPage}
                    onDelete={handleOpenDelete}
                  />
                </>
              ) : (
                /* SEARCH EMPTY STATE */
                <div className="border-t border-base-300/50 px-5 py-12 text-center md:px-6">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-base-content/40">
                    Search
                  </p>

                  <h3 className="mt-2 font-serif text-xl tracking-tight">
                    No matching products
                  </h3>

                  <p className="mt-2 text-sm text-base-content/50">
                    Tidak ada product yang cocok
                    {search ? ` dengan "${search}"` : ""}.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* DELETE MODAL */}
        <ProductDeleteModal
          product={deletingProduct}
          loading={deleteLoading}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default Product;

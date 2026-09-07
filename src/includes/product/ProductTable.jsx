import { useNavigate } from "react-router-dom";

const ProductTable = ({
  products,
  loadMoreRef,
  loadingMore,
  hasNextPage,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-base-300">
              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Product
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Brand
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Gender
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Category
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Price
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Stock
              </th>

              <th className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Status
              </th>

              <th className="text-right text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/45">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const originalPrice = Number(
                product.originalPrice ?? product.price ?? 0,
              );

              const discountedPrice = Number(
                product.discountedPrice ?? product.price ?? 0,
              );

              const discountPercent = Number(
                product.discountPercent ?? 0,
              );

              const stock = Number(product.stock ?? 0);

              return (
                <tr
                  key={product.id}
                  className="border-b border-base-200 transition-colors hover:bg-base-200/40"
                >
                  {/* PRODUCT */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-base-200">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-1 text-center text-[9px] uppercase tracking-[0.12em] text-base-content/35">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="max-w-[220px] truncate text-sm font-semibold"
                          title={product.name}
                        >
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-base-content/35">
                          ID #{product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* BRAND */}
                  <td>
                    <span className="text-sm text-base-content/70">
                      {product.brand || "Tanpa Brand"}
                    </span>
                  </td>

                  {/* GENDER */}
                  <td>
                    {product.gender === "MEN" ? (
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/55">
                        Men
                      </span>
                    ) : product.gender === "WOMEN" ? (
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/55">
                        Women
                      </span>
                    ) : (
                      <span className="text-xs text-base-content/35">
                        —
                      </span>
                    )}
                  </td>

                  {/* CATEGORY */}
                  <td>
                    {product.category ? (
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/55">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-base-content/35">
                        —
                      </span>
                    )}
                  </td>

                  {/* PRICE */}
                  <td>
                    <div className="flex flex-col">
                      {discountPercent > 0 && (
                        <span className="text-xs text-base-content/40 line-through">
                          Rp {originalPrice.toLocaleString("id-ID")}
                        </span>
                      )}

                      <span
                        className={`text-sm font-semibold ${
                          discountPercent > 0
                            ? "text-primary"
                            : "text-base-content"
                        }`}
                      >
                        Rp {discountedPrice.toLocaleString("id-ID")}
                      </span>

                      {discountPercent > 0 && (
                        <span className="mt-1 w-fit text-[9px] font-medium uppercase tracking-[0.12em] text-error">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </td>

                  {/* STOCK */}
                  <td>
                    <span className="text-sm font-semibold">
                      {stock}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`text-[9px] font-medium uppercase tracking-[0.16em] ${
                        stock > 0
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {stock > 0 ? "Tersedia" : "Habis"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm border-base-300 bg-transparent px-4 font-medium hover:border-primary hover:bg-primary hover:text-primary-content"
                        onClick={() =>
                          navigate(
                            `/Products/edit/${product.id}`,
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-error btn-outline px-4"
                        onClick={() => onDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* INFINITE SCROLL */}
            {hasNextPage && (
              <tr ref={loadMoreRef}>
                <td colSpan={8}>
                  <div className="flex min-h-20 items-center justify-center">
                    {loadingMore && (
                      <div className="flex items-center gap-3 py-6">
                        <span className="loading loading-spinner loading-sm text-primary" />

                        <span className="text-xs uppercase tracking-[0.15em] text-base-content/40">
                          Memuat product...
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* END */}
            {!hasNextPage && products.length > 0 && (
              <tr>
                <td colSpan={8}>
                  <p className="py-6 text-center text-[10px] uppercase tracking-[0.2em] text-base-content/35">
                    Semua product telah ditampilkan.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;

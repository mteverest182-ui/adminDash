import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const stock = Number(product.stock ?? 0);
  const originalPrice = Number(
    product.originalPrice ?? product.price ?? 0,
  );
  const discountedPrice = Number(
    product.discountedPrice ?? product.price ?? 0,
  );
  const discountPercent = Number(product.discountPercent ?? 0);

  const isAvailable = stock > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* IMAGE */}
      <figure className="relative aspect-[4/3] overflow-hidden bg-base-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-base-content/35">
              Tidak ada gambar
            </span>
          </div>
        )}

        {/* STOCK STATUS */}
        <div className="absolute right-4 top-4">
          <span
            className={`badge border-none px-3 py-3 text-[9px] font-medium uppercase tracking-[0.15em] shadow-sm ${
              isAvailable
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {isAvailable ? "Tersedia" : "Habis"}
          </span>
        </div>

        {/* DISCOUNT */}
        {discountPercent > 0 && (
          <div className="absolute left-4 top-4">
            <span className="badge border-none bg-primary px-3 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-content shadow-sm">
              {discountPercent}% OFF
            </span>
          </div>
        )}
      </figure>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* META */}
        {(product.gender || product.category) && (
          <div className="mb-4 flex items-center gap-2">
            {product.gender && (
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-base-content/40">
                {product.gender === "MEN" ? "Men" : "Women"}
              </span>
            )}

            {product.gender && product.category && (
              <span className="h-2.5 w-px bg-base-content/15" />
            )}

            {product.category && (
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-base-content/40">
                {product.category.name}
              </span>
            )}
          </div>
        )}

        {/* NAME */}
        <h3
          className="line-clamp-2 text-base font-semibold leading-snug tracking-tight"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* BRAND */}
        <p className="mt-1 text-xs text-base-content/45">
          {product.brand || "Tanpa brand"}
        </p>

        {/* PRICE */}
        <div className="mt-5">
          {discountPercent > 0 && (
            <p className="text-xs text-base-content/40 line-through">
              Rp {originalPrice.toLocaleString("id-ID")}
            </p>
          )}

          <p
            className={`mt-1 text-xl font-semibold tracking-tight ${
              discountPercent > 0
                ? "text-primary"
                : "text-base-content"
            }`}
          >
            Rp {discountedPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {/* STOCK */}
        <div className="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-base-content/40">
            Stock
          </span>

          <span className="text-sm font-semibold">
            {stock}
          </span>
        </div>

        {/* ACTION */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            className="btn btn-sm w-full border-none bg-primary text-primary-content transition-colors hover:bg-accent"
            onClick={() =>
              navigate(`/Products/edit/${product.id}`)
            }
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

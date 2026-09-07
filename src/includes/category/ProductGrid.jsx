import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, selectedCategory }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center py-20 text-center">
          <h3 className="text-lg font-semibold">Belum ada product</h3>

          <p className="text-sm text-base-content/60">
            {selectedCategory
              ? `Belum ada product pada category ${selectedCategory.name}.`
              : "Belum ada product yang tersedia."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

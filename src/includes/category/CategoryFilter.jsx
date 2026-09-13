const CategoryFilter = ({
  categories,
  selectedCategory,
  selectedGender,
  loading,
  categoryLoading,
  onChange,
  onGenderChange,
  onDelete,
}) => {
  const isLoading =
    loading || categoryLoading;

  return (
    <div className="card mb-6 bg-base-100 shadow-sm">
      <div className="card-body">

        {/* HEADER */}
        <div className="flex items-center">
          <div>
            <h2 className="font-semibold">
              Filter Product
            </h2>

            <p className="text-sm text-base-content/60">
              Pilih category atau gender untuk
              melihat product.
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              className="btn btn-sm btn-error btn-outline ml-auto"
              onClick={() =>
                onDelete(selectedCategory)
              }
              disabled={isLoading}
            >
              Hapus Category
            </button>
          )}
        </div>

        {/* FILTER */}
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">
            Filter 
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">

            {/* SEMUA */}
            <button
              type="button"
              className={`btn shrink-0 ${
                selectedCategory === null &&
                selectedGender === ""
                  ? "btn-primary"
                  : "btn-outline"
              }`}
              onClick={() => onChange(null)}
              disabled={isLoading}
            >
              Semua
            </button>

            {/* CATEGORY */}
            {categoryLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`btn shrink-0 ${
                    selectedCategory?.id ===
                    category.id
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={() =>
                    onChange(category)
                  }
                  disabled={isLoading}
                >
                  {category.name}
                </button>
              ))
            )}

            {/* MEN */}
            <button
              type="button"
              className={`btn shrink-0 ${
                selectedGender === "MEN"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
              onClick={() =>
                onGenderChange("MEN")
              }
              disabled={isLoading}
            >
              Men
            </button>

            {/* WOMEN */}
            <button
              type="button"
              className={`btn shrink-0 ${
                selectedGender === "WOMEN"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
              onClick={() =>
                onGenderChange("WOMEN")
              }
              disabled={isLoading}
            >
              Women
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;

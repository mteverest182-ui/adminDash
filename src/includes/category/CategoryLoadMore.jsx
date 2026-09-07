const CategoryLoadMore = ({ loading, hasNextPage, productsLength }) => {
  if (productsLength === 0 || !hasNextPage) {
    return null;
  }

  return (
    <div className="flex justify-center py-10">
      {loading ? (
        <div className="flex items-center gap-3">
          <span className="loading loading-spinner loading-sm" />

          <span className="text-sm text-base-content/60">
            Memuat product...
          </span>
        </div>
      ) : (
        <span className="text-sm text-base-content/40">
          Scroll untuk memuat product berikutnya
        </span>
      )}
    </div>
  );
};

export default CategoryLoadMore;

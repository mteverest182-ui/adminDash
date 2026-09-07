const CategoryProducts = ({ selectedCategory, total }) => {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold">
        {selectedCategory ? selectedCategory.name : "Semua Product"}
      </h2>

      <p className="text-sm text-base-content/60">{total} product</p>
    </div>
  );
};

export default CategoryProducts;

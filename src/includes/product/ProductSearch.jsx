const ProductSearch = ({ value, onChange, disabled = false }) => {
  return (
    <div className="mb-6">
      <label className="input input-bordered flex w-full max-w-md items-center gap-2 bg-base-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4 opacity-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.3-4.3m2.3-5.7a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
          />
        </svg>

        <input
          type="search"
          placeholder="Search product..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="grow"
        />
      </label>
    </div>
  );
};

export default ProductSearch;

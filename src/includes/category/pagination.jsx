const Pagination = ({
  page,
  pagination,
  onPageChange,
}) => {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">

      {/* PREVIOUS */}

      <button
        type="button"
        className="btn btn-sm"
        disabled={!pagination.hasPreviousPage}
        onClick={() =>
          onPageChange(page - 1)
        }
      >
        ←
      </button>

      {/* PAGE NUMBER */}

      {Array.from(
        {
          length: pagination.totalPages,
        },
        (_, index) => index + 1
      ).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className={`btn btn-sm ${
            pageNumber === page
              ? "btn-primary"
              : "btn-ghost"
          }`}
          onClick={() =>
            onPageChange(pageNumber)
          }
        >
          {pageNumber}
        </button>
      ))}

      {/* NEXT */}

      <button
        type="button"
        className="btn btn-sm"
        disabled={!pagination.hasNextPage}
        onClick={() =>
          onPageChange(page + 1)
        }
      >
        →
      </button>

    </div>
  );
};

export default Pagination;
import { useNavigate } from "react-router-dom";

const ProductHeader = () => {
  const navigate = useNavigate();

  return (
      <button
        type="button"
        onClick={() => navigate("/Products/create")}
        className="btn border-none bg-primary text-white hover:bg-yellow-500"
      >
        + Tambah Product
      </button>
  );
};

export default ProductHeader;

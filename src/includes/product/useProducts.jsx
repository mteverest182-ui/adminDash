import { useCallback, useEffect, useRef, useState } from "react";
import { deleteProducts, getProducts } from "../../api/product.api.js";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const useProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const loadingMoreRef = useRef(false);
  const loadMoreRef = useRef(null);

  const fetchProducts = useCallback(
    async (pageNumber = 1, searchValue = "") => {
      try {
        if (pageNumber === 1) {
          setLoading(true);
        }

        setError("");

        const response = await getProducts(pageNumber, 8, searchValue);

        console.log("GET PRODUCTS:", response);

        const newProducts = response.data ?? [];

        const paginationData = response.pagination ?? DEFAULT_PAGINATION;

        if (pageNumber === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setPage(paginationData.page ?? pageNumber);

        setHasNextPage(paginationData.hasNextPage ?? false);

        setPagination(paginationData);
      } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        if (pageNumber === 1) {
          setProducts([]);
        }

        setError(
          error.response?.data?.message || "Gagal mengambil data product",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts(1, "");
  }, [fetchProducts]);

  const handleSearch = async (value) => {
    setSearch(value);
    setPage(1);
    setHasNextPage(false);

    await fetchProducts(1, value);
  };

  const loadMoreProducts = useCallback(async () => {
    if (loadingMoreRef.current || loading || loadingMore || !hasNextPage) {
      return;
    }

    loadingMoreRef.current = true;

    try {
      setLoadingMore(true);
      setError("");

      const nextPage = page + 1;

      const response = await getProducts(nextPage, 8, search);

      console.log("LOAD MORE PRODUCTS:", response);

      const newProducts = response.data ?? [];

      const paginationData = response.pagination ?? DEFAULT_PAGINATION;

      setProducts((prev) => [...prev, ...newProducts]);

      setPage(paginationData.page ?? nextPage);

      setHasNextPage(paginationData.hasNextPage ?? false);

      setPagination(paginationData);
    } catch (error) {
      console.error("LOAD MORE PRODUCTS ERROR:", error);

      setError(
        error.response?.data?.message || "Gagal mengambil product berikutnya",
      );
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [page, search, hasNextPage, loading, loadingMore]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !loadingMore && !loading) {
          loadMoreProducts();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, loadingMore, loading, loadMoreProducts]);

  const removeProductFromState = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));

    setPagination((prev) => ({
      ...prev,
      total: Math.max(0, (prev.total ?? 0) - 1),
    }));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setError("");

      await deleteProducts(productId);

      removeProductFromState(productId);
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      throw error;
    }
  };

  return {
    products,
    loading,
    loadingMore,
    error,

    search,

    page,
    hasNextPage,
    pagination,

    loadMoreRef,

    fetchProducts,
    handleSearch,
    loadMoreProducts,
    handleDeleteProduct,

    setError,
  };
};

export default useProducts;

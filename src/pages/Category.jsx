import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCategories,
  deleteCategory,
} from "../api/category.api";

import {
  getProducts,
  getCategoryProducts,
} from "../api/product.api";

import CategoryFilter from "../includes/category/CategoryFilter";
import ProductGrid from "../includes/category/ProductGrid";

import useEscapeKey from "../features/useEscapeKey";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedGender, setSelectedGender] =
    useState("");

  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [pagination, setPagination] =
    useState(DEFAULT_PAGINATION);

  const [error, setError] = useState("");

  // Mencegah load more berjalan dua kali
  const loadingMoreRef = useRef(false);

  // Menandai request product terbaru
  const productRequestRef = useRef(0);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = useCallback(
    async () => {
      try {
        setCategoryLoading(true);
        setError("");

        const response =
          await getCategories();

        const data = Array.isArray(
          response.data,
        )
          ? response.data
          : [];

        setCategories(data);
      } catch (error) {
        console.error(
          "GET CATEGORIES ERROR:",
          error,
        );

        setCategories([]);

        setError(
          error.response?.data?.message ||
            "Gagal mengambil data category",
        );
      } finally {
        setCategoryLoading(false);
      }
    },
    [],
  );

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = useCallback(
    async (
      page = 1,
      categoryId = null,
      gender = "",
      append = false,
    ) => {
      const requestId =
        ++productRequestRef.current;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setProductLoading(true);
        }

        setError("");

        let response;

        // =====================================================
        // CATEGORY
        // =====================================================

        if (categoryId) {
          response =
            await getCategoryProducts(
              categoryId,
              page,
              8,
              "",
            );

          const newProducts =
            response.data?.products ??
            [];

          const newPagination =
            response.data?.pagination ??
            DEFAULT_PAGINATION;

          // Request ini sudah tidak aktif
          if (
            requestId !==
            productRequestRef.current
          ) {
            return;
          }

          if (append) {
            setProducts((prev) => [
              ...prev,
              ...newProducts,
            ]);
          } else {
            setProducts(newProducts);
          }

          setPagination(
            newPagination,
          );

          return;
        }

        // =====================================================
        // ALL PRODUCTS / MEN / WOMEN
        // =====================================================

        response = await getProducts(
          page,
          8,
          "",
          gender,
        );

        const newProducts =
          response.data ?? [];

        const newPagination =
          response.pagination ??
          DEFAULT_PAGINATION;

        // Request ini sudah tidak aktif
        if (
          requestId !==
          productRequestRef.current
        ) {
          return;
        }

        if (append) {
          setProducts((prev) => [
            ...prev,
            ...newProducts,
          ]);
        } else {
          setProducts(newProducts);
        }

        setPagination(
          newPagination,
        );
      } catch (error) {
        console.error(
          "GET PRODUCTS ERROR:",
          error,
        );

        // Jangan biarkan request lama
        // menghapus data request terbaru
        if (
          requestId !==
          productRequestRef.current
        ) {
          return;
        }

        if (!append) {
          setProducts([]);
          setPagination(
            DEFAULT_PAGINATION,
          );
        }

        setError(
          error.response?.data?.message ||
            "Gagal mengambil product",
        );
      } finally {
        if (
          requestId ===
          productRequestRef.current
        ) {
          setProductLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [],
  );

  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchProducts(
          1,
          null,
          "",
          false,
        ),
      ]);
    };

    loadInitialData();
  }, [
    fetchCategories,
    fetchProducts,
  ]);

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  const handleCategoryChange = async (category) => {

  setSelectedCategory(category);
  setSelectedGender("");

  setProducts([]);
  setPagination(DEFAULT_PAGINATION);

  if (!category) {
    await fetchProducts(
      1,
      null,
      "",
      false,
    );

    return;
  }

  if (!category.id) {

    setError(
      "Category ID tidak ditemukan",
    );

    return;
  }

  await fetchProducts(
    1,
    category.id,
    "",
    false,
  );
};


  // =========================================================
  // GENDER CHANGE
  // =========================================================

  const handleGenderChange = async (
    gender,
  ) => {
    // Gender aktif
    setSelectedGender(gender);

    // Category dimatikan
    setSelectedCategory(null);

    // Reset product
    setProducts([]);

    // Reset pagination
    setPagination(
      DEFAULT_PAGINATION,
    );

    // PENTING:
    // MEN/WOMEN menggunakan getProducts()
    await fetchProducts(
      1,
      null,
      gender,
      false,
    );
  };

  // =========================================================
  // LOAD MORE
  // =========================================================

  const loadMoreProducts = useCallback(
    async () => {
      if (
        loadingMoreRef.current ||
        productLoading ||
        !pagination.hasNextPage
      ) {
        return;
      }

      loadingMoreRef.current = true;

      try {
        const nextPage =
          pagination.page + 1;

        const categoryId =
          selectedCategory?.id ??
          null;

        const gender =
          selectedGender;

        await fetchProducts(
          nextPage,
          categoryId,
          gender,
          true,
        );
      } finally {
        loadingMoreRef.current = false;
      }
    },
    [
      pagination,
      productLoading,
      selectedCategory,
      selectedGender,
      fetchProducts,
    ],
  );

  // =========================================================
  // INFINITE SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY;

      const windowHeight =
        window.innerHeight;

      const documentHeight =
        document.documentElement
          .scrollHeight;

      const distanceFromBottom =
        documentHeight -
        (scrollTop + windowHeight);

      if (
        distanceFromBottom < 400 &&
        pagination.hasNextPage &&
        !loadingMore &&
        !productLoading
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, [
    pagination.hasNextPage,
    loadingMore,
    productLoading,
    loadMoreProducts,
  ]);

  // =========================================================
  // ESCAPE / RESET FILTER
  // =========================================================

  const handleEscape = useCallback(() => {
    const hasActiveFilter =
      selectedCategory ||
      selectedGender;

    if (!hasActiveFilter) {
      return;
    }

    setSelectedCategory(null);
    setSelectedGender("");

    setProducts([]);

    setPagination(
      DEFAULT_PAGINATION,
    );

    fetchProducts(
      1,
      null,
      "",
      false,
    );
  }, [
    selectedCategory,
    selectedGender,
    fetchProducts,
  ]);

  useEscapeKey(
    handleEscape,
    !productLoading &&
      !loadingMore,
  );

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const handleDeleteCategory = async (
    category,
  ) => {
    try {
      setError("");

      await deleteCategory(
        category.id,
      );

      setCategories((prev) =>
        prev.filter(
          (item) =>
            item.id !== category.id,
        ),
      );

      setSelectedCategory(null);

      setProducts([]);

      setPagination(
        DEFAULT_PAGINATION,
      );

      await fetchProducts(
        1,
        null,
        selectedGender,
        false,
      );
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Gagal menghapus category",
      );
    }
  };

  // =========================================================
  // PRODUCT DELETED
  // =========================================================

  const handleProductDeleted = (
    productId,
  ) => {
    setProducts((prev) =>
      prev.filter(
        (product) =>
          product.id !== productId,
      ),
    );
  };

  // =========================================================
  // CURRENT TITLE
  // =========================================================

  const currentTitle =
    selectedCategory
      ? selectedCategory.name
      : selectedGender === "MEN"
        ? "Men"
        : selectedGender === "WOMEN"
          ? "Women"
          : "Semua Product";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-base-200 px-5 py-4 md:px-8 md:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ERROR */}
        {error && (
          <div className="alert alert-error mb-6 border border-error/20">
            <span>{error}</span>
          </div>
        )}

        {/* CATEGORY FILTER */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.3em] text-primary">
              Filter
            </p>

            <h2 className="mb-6 mt-1 text-2xl font-[Philosophy] lg:text-6xl">
              Product Selection
            </h2>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={
              selectedCategory
            }
            selectedGender={
              selectedGender
            }
            loading={categoryLoading}
            onChange={
              handleCategoryChange
            }
            onGenderChange={
              handleGenderChange
            }
            onDelete={
              handleDeleteCategory
            }
          />
        </section>

        {/* PRODUCT LIST HEADER */}
        <section className="mb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                Collection
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {currentTitle}
              </h2>
            </div>

            <p className="text-xs text-base-content/45">
              {pagination.total} product
            </p>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <ProductGrid
          products={products}
          loading={productLoading}
          selectedCategory={
            selectedCategory
          }
          onDeleted={
            handleProductDeleted
          }
        />

        {/* LOAD MORE */}
        {!productLoading &&
          products.length > 0 &&
          pagination.hasNextPage && (
            <div className="flex justify-center py-10">
              {loadingMore ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner loading-sm text-primary" />

                  <span className="text-[10px] uppercase tracking-[0.18em] text-base-content/40">
                    Memuat product...
                  </span>
                </div>
              ) : (
                <span className="text-[10px] uppercase tracking-[0.18em] text-base-content/35">
                  Scroll untuk memuat
                  product berikutnya
                </span>
              )}
            </div>
          )}

        {/* END */}
        {!productLoading &&
          products.length > 0 &&
          !pagination.hasNextPage && (
            <div className="py-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-base-content/35">
                Semua product telah
                ditampilkan.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Category;

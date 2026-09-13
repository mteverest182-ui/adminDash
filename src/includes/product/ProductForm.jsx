import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import RupiahInput from "../../function/FormatRupiah";
import { getCategories, createCategory } from "../../api/category.api";

import {
  validateProductField,
  validateProductForm,
} from "./ProductValidation";

import useEscapeKey from "../../features/useEscapeKey";

const DISCOUNT_OPTIONS = [10, 15, 20, 35];

const ProductForm = ({
  initialData = null,
  onSubmit,
  loading = false,
}) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    gender: "",
    categoryId: "",
    price: "",
    discountPercent: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // =========================================================
  // CANCEL / ESCAPE
  // =========================================================

  const handleCancel = useCallback(() => {
    if (loading) return;

    navigate(-1);
  }, [loading, navigate]);

  useEscapeKey(handleCancel, !loading);

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const getInputClass = (field) => {
    const baseClass = "input input-bordered w-full";

    if (!touched[field]) {
      return baseClass;
    }

    if (errors[field]) {
      return `${baseClass} input-error`;
    }

    return `${baseClass} input-success`;
  };

  const getFileInputClass = () => {
    if (!touched.image) {
      return "file-input file-input-bordered w-full";
    }

    if (errors.image) {
      return "file-input file-input-bordered file-input-error w-full";
    }

    return "file-input file-input-bordered file-input-success w-full";
  };

  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name ?? "",
      brand: initialData.brand ?? "",
      gender: initialData.gender ?? "",
      categoryId: initialData.categoryId
        ? String(initialData.categoryId)
        : "",
      price: initialData.price ?? "",
      discountPercent: initialData.discountPercent ?? 0,
      stock: initialData.stock ?? "",
    });

    if (initialData.image) {
      setPreview(initialData.image);
    }
  }, [initialData]);

  // =========================================================
  // FETCH CATEGORY
  // =========================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setError("");

      const response = await getCategories();
      

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      console.error(
        error,
      );

      setCategories([]);

      setError(
        error.response?.data?.message
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================================
  // PRICE
  // =========================================================

  const handlePriceChange = (value) => {
    setForm((prev) => ({
      ...prev,
      price: value,
    }));

    setTouched((prev) => ({
      ...prev,
      price: true,
    }));

    const validationError =
      validateProductField(
        "price",
        value,
      );

    setErrors((prev) => ({
      ...prev,
      price: validationError,
    }));
  };

  // =========================================================
  // GENERAL INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const validationError =
        validateProductField(
          name,
          value,
        );

      setErrors((prev) => ({
        ...prev,
        [name]: validationError,
      }));
    }
  };

  // =========================================================
  // DISCOUNT PRESET
  // =========================================================

  const handleDiscountSelect = (discount) => {
    const value = String(discount);

    setForm((prev) => ({
      ...prev,
      discountPercent: value,
    }));

    setTouched((prev) => ({
      ...prev,
      discountPercent: true,
    }));

    const validationError =
      validateProductField(
        "discountPercent",
        value,
      );

    setErrors((prev) => ({
      ...prev,
      discountPercent: validationError,
    }));
  };

  // =========================================================
  // BLUR
  // =========================================================

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const validationError =
      validateProductField(
        name,
        value,
      );

    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setTouched((prev) => ({
      ...prev,
      image: true,
    }));

    if (!file) {
      if (initialData?.image) {
        setImage(null);

        setErrors((prev) => ({
          ...prev,
          image: "",
        }));

        return;
      }

      setImage(null);
      setPreview(null);

      setErrors((prev) => ({
        ...prev,
        image: "Foto product wajib dipilih",
      }));

      return;
    }

    if (!file.type.startsWith("image/")) {
      setImage(null);

      setErrors((prev) => ({
        ...prev,
        image: "File harus berupa gambar",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImage(null);

      setErrors((prev) => ({
        ...prev,
        image: "Ukuran gambar maksimal 5MB",
      }));

      return;
    }

    setImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    const newErrors =
      validateProductForm(
        form,
        image,
      );

    if (initialData?.image && !image) {
      delete newErrors.image;
    }

    setErrors(newErrors);

    setTouched({
      name: true,
      brand: true,
      gender: true,
      categoryId: true,
      price: true,
      discountPercent: true,
      stock: true,
      image: true,
    });

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    await onSubmit({
      form,
      image,
    });
  };

  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  const handleCreateCategory = async () => {
    const trimmedName =
      newCategoryName.trim();

    if (!trimmedName) {
      setError(
        "Nama category wajib diisi",
      );
      return;
    }

    try {
      setCategoryCreating(true);
      setError("");

      const response =
        await createCategory({
          name: trimmedName,
        });

      const newCategory =
        response.data;

      setCategories((prev) => [
        ...prev,
        newCategory,
      ]);

      setForm((prev) => ({
        ...prev,
        categoryId: String(
          newCategory.id,
        ),
      }));

      setTouched((prev) => ({
        ...prev,
        categoryId: true,
      }));

      setErrors((prev) => ({
        ...prev,
        categoryId: "",
      }));

      setNewCategoryName("");
    } catch (error) {
      console.error(
        error,
      );

      setError(
        error.response?.data?.message
      );
    } finally {
      setCategoryCreating(false);
    }
  };

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const numericPrice =
    Number(form.price) || 0;

  const numericDiscount =
    Number(form.discountPercent) || 0;

  const discountedPrice =
    numericDiscount > 0
      ? Math.round(
          numericPrice -
            (numericPrice *
              numericDiscount) /
              100,
        )
      : numericPrice;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      },
    ).format(value);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* NAME */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Nama Product
          </span>
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Masukkan Nama Product"
          className={getInputClass("name")}
        />

        {touched.name &&
          errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.name}
              </span>
            </label>
          )}
      </div>

      {/* BRAND */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Brand
          </span>
        </label>

        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Masukkan Brand"
          className={getInputClass("brand")}
        />

        {touched.brand &&
          errors.brand && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.brand}
              </span>
            </label>
          )}
      </div>

      {/* GENDER */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Gender
          </span>
        </label>

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`select select-bordered w-full ${
            touched.gender
              ? errors.gender
                ? "select-error"
                : "select-success"
              : ""
          }`}
        >
          <option value="">
            Pilih gender
          </option>

          <option value="MEN">
            Men
          </option>

          <option value="WOMEN">
            Women
          </option>
        </select>

        {touched.gender &&
          errors.gender && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.gender}
              </span>
            </label>
          )}

        {!errors.gender && (
          <label className="label">
            <span className="label-text-alt text-base-content/50">
              Tentukan product untuk Men
              atau Women.
            </span>
          </label>
        )}
      </div>

      {/* CATEGORY */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">
            Category
          </span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`select select-bordered flex-1 ${
              errors.categoryId
                ? "select-error"
                : form.categoryId
                  ? "select-success"
                  : ""
            }`}
          >
            <option value="">
              {categoryLoading
                ? "Memuat category..."
                : "Pilih category"}
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={String(
                    category.id,
                  )}
                >
                  {category.name}
                </option>
              ),
            )}
          </select>

          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) =>
                setNewCategoryName(
                  event.target.value,
                )
              }
              placeholder="Atau buat category baru"
              className="input input-bordered w-full"
              disabled={
                categoryLoading ||
                categoryCreating
              }
            />

            <button
              type="button"
              className="btn btn-outline"
              onClick={
                handleCreateCategory
              }
              disabled={
                categoryLoading ||
                categoryCreating ||
                !newCategoryName.trim()
              }
            >
              {categoryCreating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Menambah...
                </>
              ) : (
                "+ Tambah"
              )}
            </button>
          </div>
        </div>

        <label className="label">
          <span className="label-text-alt text-base-content/50">
            Pilih category yang sudah
            ada atau buat category baru.
          </span>
        </label>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* PRICE */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Harga
          </span>
        </label>

        {numericPrice > 0 && (
          <div className="mb-2 rounded-lg bg-base-200 px-4 py-3">
            {numericDiscount > 0 ? (
              <>
                <div className="text-sm text-base-content/60">
                  Harga normal
                </div>

                <div className="text-lg font-semibold line-through text-base-content/50">
                  {formatCurrency(
                    numericPrice,
                  )}
                </div>

                <div className="mt-1 text-xl font-bold text-primary">
                  {formatCurrency(
                    discountedPrice,
                  )}
                </div>

                <div className="text-sm font-medium text-success">
                  Hemat{" "}
                  {formatCurrency(
                    numericPrice -
                      discountedPrice,
                  )}{" "}
                  ({numericDiscount}%)
                </div>
              </>
            ) : (
              <div>
                <div className="text-sm text-base-content/60">
                  Harga jual
                </div>

                <div className="text-xl font-bold">
                  {formatCurrency(
                    numericPrice,
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <RupiahInput
          value={form.price}
          onChange={handlePriceChange}
          className={getInputClass(
            "price",
          )}
        />

        {touched.price &&
          errors.price && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.price}
              </span>
            </label>
          )}
      </div>

      {/* DISCOUNT + STOCK */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* DISCOUNT */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">
              Discount
            </span>
          </label>

          <div className="mb-2 flex flex-wrap gap-2">
            {DISCOUNT_OPTIONS.map(
              (discount) => (
                <button
                  key={discount}
                  type="button"
                  onClick={() =>
                    handleDiscountSelect(
                      discount,
                    )
                  }
                  disabled={loading}
                  className={`btn btn-sm ${
                    Number(
                      form.discountPercent,
                    ) === discount
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {discount}%
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                handleDiscountSelect(0)
              }
              disabled={loading}
              className={`btn btn-sm ${
                Number(
                  form.discountPercent,
                ) === 0
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              0%
            </button>
          </div>

          <div className="join w-full">
            <input
              type="number"
              name="discountPercent"
              min="0"
              max="100"
              step="1"
              value={
                form.discountPercent ??
                0
              }
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input input-bordered w-full ${
                touched.discountPercent
                  ? errors.discountPercent
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
              placeholder="0"
            />

            <span className="btn btn-disabled join-item">
              %
            </span>
          </div>

          {touched.discountPercent &&
            errors.discountPercent && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.discountPercent}
                </span>
              </label>
            )}

          <label className="label">
            <span className="label-text-alt text-base-content/50">
              Pilih discount atau masukkan
              manual 0-100%
            </span>
          </label>
        </div>

        {/* STOCK */}
        <div className="form-control mt-9 w-full">
          <label className="label">
            <span className="label-text font-medium">
              Stock
            </span>
          </label>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Masukkan Stock"
            min="0"
            className={getInputClass(
              "stock",
            )}
          />

          {touched.stock &&
            errors.stock && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.stock}
                </span>
              </label>
            )}
        </div>
      </div>

      {/* IMAGE */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Foto Product
          </span>
        </label>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className={getFileInputClass()}
        />

        {touched.image &&
        errors.image ? (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.image}
            </span>
          </label>
        ) : (
          <label className="label">
            <span className="label-text-alt">
              Pilih Gambar Product
            </span>
          </label>
        )}
      </div>

      {/* PREVIEW IMAGE */}
      {preview && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Preview
          </p>

          <div className="overflow-hidden rounded-xl border border-base-300">
            <img
              src={preview}
              alt="Preview Product"
              className="h-72 w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* BUTTON */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="btn"
          onClick={handleCancel}
          disabled={loading}
        >
          Batal
        </button>

        <button
          type="submit"
          className="btn border-none bg-primary text-white hover:bg-yellow-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Menyimpan...
            </>
          ) : (
            "Simpan Product"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
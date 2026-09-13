import { useEffect, useState, } from "react";

const AdminForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username ?? "",
        email: initialData.email ?? "",
        password: "",
      });
    } else {
      setForm({
        username: "",
        email: "",
        password: "",
      });
    }

    setError("");
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    if (!form.username.trim()) {
      setError("Username wajib diisi");
      setFieldErrors({ username: true });
      return;
    }

    if (!form.email.trim()) {
      setError("Email wajib di isi");
      
      setFieldErrors({ email: true });
      return;
    }

    if (!isEdit && !form.password) {
      setError("Password Wajib di Isi");
      setFieldErrors({ password: true });
      return;
    }

    if (form.password && form.password.length < 8) {
      setError("Password Minimal 8 karakter");
      setFieldErrors({ password: true });
      return;
    }

    try {
      await onSubmit({
        username: form.username.trim(),
        email: form.email.trim(),
        ...(form.password ? { password: form.password } : {}),
      });
    } catch (error) {
      const message =
        typeof error?.response?.data?.message === "string"
          ? error.response.data.message
          : "Gagal menyimpan data admin";

      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Username</span>
        </label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Masukkan Username"
          className={`input input-bordered w-full ${
            fieldErrors.username
              ? "input-error"
              : form.username.trim()
                ? "input-success"
                : ""
          }`}
          disabled={loading}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          className={`input input-bordered w-full ${
            fieldErrors.email
              ? "input-error"
              : form.email.trim()
                ? "input-success"
                : ""
          }`}
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="span label-text font-medium">Password</span>
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={
            isEdit
              ? "Kosongkan jika tidak ingin mengubah"
              : "Minimal 8 karakter"
          }
          className={`input input-bordered w-full ${
            fieldErrors.password
              ? "input-error"
              : form.password.trim()
                ? "input-success"
                : ""
          }`}
          disabled={loading}
        />

        {isEdit && (
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Isi Password hanya jika ingin mennggantinya.
            </span>
          </label>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          className="btn"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </button>

        <button
          type="submit"
          className="btn bg-primary border-none text-white hover:bg-yellow-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Menyimpan...
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Admin"
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;

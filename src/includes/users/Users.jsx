import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getUsers,
    updateAdmin,
    deleteAdmin,
    createUser,
} from "../../api/user.api";

import useEscapeKey from "../../features/useEscapeKey";

import AdminForm from "../../components/AdminForm";

const Users = () => {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const [editingAdmin, setEditingAdmin] =
        useState(null);

    const [deletingAdmin, setDeletingAdmin] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    /*
     * GET ADMIN ACCOUNTS
     */
    const fetchUsers = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getUsers();

                console.log(
                    "GET ADMIN ACCOUNTS:",
                    response,
                );

                setUsers(
                    response?.data ?? [],
                );
            } catch (error) {
                console.error(
                    "GET ADMIN ACCOUNTS ERROR:",
                    error,
                );

                setError(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Gagal mengambil data administrator",
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /*
     * STATISTICS
     *
     * Karena sekarang hanya ada satu role:
     * ADMIN
     */
    const totalAdmin = users.filter(
        (user) =>
            user.role === "ADMIN",
    ).length;

    /*
     * CREATE ADMIN
     */
    const handleOpenCreate = () => {
        setEditingAdmin(null);
        setIsFormOpen(true);
        setError("");
    };

    /*
     * EDIT ADMIN
     */
    const handleOpenEdit = (user) => {
        if (user.role !== "ADMIN") {
            return;
        }

        setEditingAdmin(user);
        setIsFormOpen(true);
        setError("");
    };

    /*
     * CLOSE FORM
     */
    const handleCloseForm = useCallback(
        () => {
            if (submitLoading) {
                return;
            }

            setIsFormOpen(false);
            setEditingAdmin(null);
        },
        [submitLoading],
    );

    useEscapeKey(
        handleCloseForm,
        isFormOpen,
    );

    /*
     * CREATE / UPDATE ADMIN
     */
    const handleSubmit = async (
        formData,
    ) => {
        try {
            setSubmitLoading(true);
            setError("");

            if (editingAdmin) {
                const response =
                    await updateAdmin(
                        editingAdmin.id,
                        formData,
                    );

                setUsers((prev) =>
                    prev.map((user) =>
                        user.id ===
                        editingAdmin.id
                            ? response.data
                            : user,
                    ),
                );
            } else {
                const response =
                    await createUser(
                        formData,
                    );

                setUsers((prev) => [
                    response.data,
                    ...prev,
                ]);
            }

            setIsFormOpen(false);
            setEditingAdmin(null);
        } catch (error) {
            console.error(
                "SAVE ADMIN ERROR:",
                error,
            );

            setError(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Gagal menyimpan administrator",
            );

            throw error;
        } finally {
            setSubmitLoading(false);
        }
    };

    /*
     * OPEN DELETE
     */
    const handleOpenDelete = (
        user,
    ) => {
        if (user.role !== "ADMIN") {
            return;
        }

        setDeletingAdmin(user);
    };

    /*
     * CLOSE DELETE
     */
    const handleCloseDelete = () => {
        if (deleteLoading) {
            return;
        }

        setDeletingAdmin(null);
    };

    /*
     * DELETE ADMIN
     */
    const handleConfirmDelete =
        async () => {
            if (!deletingAdmin) {
                return;
            }

            try {
                setDeleteLoading(true);
                setError("");

                await deleteAdmin(
                    deletingAdmin.id,
                );

                setUsers((prev) =>
                    prev.filter(
                        (user) =>
                            user.id !==
                            deletingAdmin.id,
                    ),
                );

                setDeletingAdmin(null);
            } catch (error) {
                console.error(
                    "DELETE ADMIN ERROR:",
                    error,
                );

                setError(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Gagal menghapus administrator",
                );
            } finally {
                setDeleteLoading(false);
            }
        };

    return (
        <div className="min-h-screen bg-base-200 px-5 py-8 md:px-8 md:py-10 lg:px-10">
            <div className="mx-auto max-w-7xl">

                {/* =========================================
                    HEADER
                ========================================= */}
                <header className="mb-10 md:mb-14">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                        <div>
                            <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-primary">
                                Management
                            </p>

                            <h1 className="mt-3 font-[Philosopher] text-4xl leading-none tracking-tight md:text-5xl lg:text-6xl">
                                Administrators
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/50">
                                Kelola administrator yang
                                memiliki akses ke dashboard
                                sistem.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary gap-2 px-6"
                            onClick={
                                handleOpenCreate
                            }
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>

                            Tambah Admin
                        </button>

                    </div>
                </header>

                {/* =========================================
                    ERROR
                ========================================= */}
                {error && !isFormOpen && (
                    <div className="mb-8 border border-error/20 bg-error/5 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />

                            <p className="text-xs text-error">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =========================================
                    STATISTICS
                ========================================= */}
                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                            Statistics
                        </p>

                        <p className="text-[9px] uppercase tracking-[0.25em] text-base-content/25">
                            Current Overview
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-px overflow-hidden border border-base-300/60 bg-base-300/60">

                        {/* ADMIN */}
                        <div className="group bg-base-100 p-6 transition-colors duration-300 hover:bg-base-200/50 md:p-8 lg:p-9">

                            <div className="flex items-start justify-between">
                                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                                    Administrator
                                </p>

                                <span className="text-[9px] tracking-[0.25em] text-primary/60">
                                    01
                                </span>
                            </div>

                            <div className="mt-10">
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm text-primary" />
                                ) : (
                                    <p className="font-[Philosopher] text-5xl leading-none tracking-tight md:text-6xl">
                                        {
                                            totalAdmin
                                        }
                                    </p>
                                )}

                                <div className="mt-5 h-px w-8 bg-primary/40 transition-all duration-500 group-hover:w-14" />

                                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-base-content/35">
                                    Administrator aktif
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* =========================================
                    ADMIN MANAGEMENT
                ========================================= */}
                <section className="mt-10 md:mt-12">

                    <div className="mb-5">
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                            Admin Management
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

                        {/* TABLE HEADER */}
                        <div className="border-b border-base-300 p-5 sm:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="font-semibold">
                                        Daftar Administrator
                                    </h2>

                                    <p className="mt-1 text-sm text-base-content/50">
                                        Semua account memiliki
                                        akses administrator.
                                    </p>
                                </div>

                                <p className="text-[9px] uppercase tracking-[0.25em] text-base-content/30">
                                    {users.length} Admin
                                </p>

                            </div>
                        </div>

                        {/* CONTENT */}
                        {loading ? (
                            <div className="flex min-h-[320px] items-center justify-center">
                                <span className="loading loading-spinner loading-md text-primary" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex min-h-[320px] items-center justify-center p-6">
                                <div className="text-center">

                                    <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/35">
                                        No Administrators
                                    </p>

                                    <h3 className="mt-3 font-[Philosopher] text-2xl">
                                        Belum ada administrator
                                    </h3>

                                    <p className="mt-2 text-sm text-base-content/50">
                                        Tambahkan administrator
                                        baru untuk mulai
                                        mengelola akses.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-primary mt-5"
                                        onClick={
                                            handleOpenCreate
                                        }
                                    >
                                        Tambah Admin
                                    </button>

                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <table className="table">

                                    <thead>
                                        <tr>
                                            <th>
                                                User
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Role
                                            </th>

                                            <th className="text-right">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map(
                                            (
                                                user,
                                            ) => {
                                                const isAdmin =
                                                    user.role ===
                                                    "ADMIN";

                                                return (
                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                    >

                                                        {/* USER */}
                                                        <td>
                                                            <div className="flex items-center gap-3">

                                                                <div className="avatar placeholder">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-300">
                                                                        <span className="font-semibold">
                                                                            {user.username
                                                                                ?.charAt(
                                                                                    0,
                                                                                )
                                                                                ?.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="min-w-0">

                                                                    <div className="font-semibold">
                                                                        {
                                                                            user.username
                                                                        }
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* EMAIL */}
                                                        <td>
                                                            <span className="text-sm">
                                                                {
                                                                    user.email
                                                                }
                                                            </span>
                                                        </td>

                                                        {/* ROLE */}
                                                        <td>
                                                            {isAdmin ? (
                                                                <span className="badge badge-outline">
                                                                    Administrator
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-base-content/40">
                                                                    Invalid Role
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* ACTION */}
                                                        <td>
                                                            <div className="flex justify-end gap-2">

                                                                {isAdmin && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm"
                                                                            onClick={() =>
                                                                                handleOpenEdit(
                                                                                    user,
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-error btn-outline"
                                                                            onClick={() =>
                                                                                handleOpenDelete(
                                                                                    user,
                                                                                )
                                                                            }
                                                                        >
                                                                            Hapus
                                                                        </button>
                                                                    </>
                                                                )}

                                                            </div>
                                                        </td>

                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                </section>

            </div>

            {/* =========================================
                CREATE / EDIT MODAL
            ========================================= */}
            {isFormOpen && (
                <div className="modal modal-open">

                    <div className="modal-box max-w-lg">

                        <h3 className="text-xl font-bold">
                            {editingAdmin
                                ? "Edit Administrator"
                                : "Tambah Administrator"}
                        </h3>

                        <p className="mb-6 mt-1 text-sm text-base-content/60">
                            {editingAdmin
                                ? "Perbarui informasi administrator."
                                : "Buat akun administrator baru."}
                        </p>

                        <AdminForm
                            initialData={
                                editingAdmin
                            }
                            onSubmit={
                                handleSubmit
                            }
                            loading={
                                submitLoading
                            }
                            onCancel={
                                handleCloseForm
                            }
                        />

                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={
                            handleCloseForm
                        }
                    />

                </div>
            )}

            {/* =========================================
                DELETE MODAL
            ========================================= */}
            {deletingAdmin && (
                <div className="modal modal-open">

                    <div className="modal-box">

                        <h3 className="text-lg font-bold">
                            Hapus Administrator
                        </h3>

                        <p className="py-4 text-sm text-base-content/70">
                            Apakah kamu yakin ingin
                            menghapus administrator{" "}
                            <span className="font-semibold text-base-content">
                                {
                                    deletingAdmin.username
                                }
                            </span>
                            ?
                        </p>

                        <div className="modal-action">

                            <button
                                type="button"
                                className="btn"
                                onClick={
                                    handleCloseDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                className="btn btn-error"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Menghapus...
                                    </>
                                ) : (
                                    "Hapus Admin"
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default Users;
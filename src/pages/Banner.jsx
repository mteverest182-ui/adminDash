import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

import {
    getBanners,
    deleteBanner,
    updateBannerStatus,
} from "../api/banner.api";

import BannerSummary from "../includes/banner/BannerSummary";
import BannerFilter from "../includes/banner/BannerFilter";
import BannerTable from "../includes/banner/BannerTable";
import BannerForm from "../includes/banner/BannerForm";
import BannerDeleteModal from "../includes/banner/BannerDeleteModal";

const Banner = () => {
    const [banners, setBanners] = useState([]);

    const [activeFilter, setActiveFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [modalOpen, setModalOpen] =
        useState(false);

    const [selectedBanner, setSelectedBanner] =
        useState(null);

    /*
     * GET BANNERS
     */
    const fetchBanners = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getBanners();

                setBanners(
                    response?.data ?? [],
                );
            } catch (error) {
                console.error(
                    "Failed to fetch banners:",
                    error,
                );

                setError(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Gagal mengambil data banner",
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    /*
     * CREATE BANNER
     */
    const handleCreate = (
        slotKey = "",
    ) => {
        setSelectedBanner(
            slotKey
                ? {
                      slotKey,
                      status: "INACTIVE",
                  }
                : null,
        );

        setModalOpen(true);
    };

    /*
     * EDIT BANNER
     */
    const handleEdit = (
        banner,
    ) => {
        setSelectedBanner(banner);
        setModalOpen(true);
    };

    /*
     * CLOSE FORM
     */
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedBanner(null);
    };

    /*
     * AFTER CREATE / UPDATE
     */
    const handleSuccess = async () => {
        handleCloseModal();
        await fetchBanners();
    };

    /*
     * ACTIVATE / DEACTIVATE
     */
    const handleStatusChange = async (
        banner,
    ) => {
        const nextStatus =
            banner.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        const action =
            nextStatus === "ACTIVE"
                ? "mengaktifkan"
                : "menonaktifkan";

        const confirmed =
            window.confirm(
                `Apakah kamu yakin ingin ${action} banner "${banner.title}"?`,
            );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            await updateBannerStatus(
                banner.id,
                nextStatus,
            );

            await fetchBanners();
        } catch (error) {
            console.error(
                "Update banner status error:",
                error,
            );

            setError(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Gagal memperbarui status banner",
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * OPEN DELETE MODAL
     */
    const handleDelete = (
        banner,
    ) => {
        setDeleteTarget(banner);
    };

    /*
     * DELETE BANNER
     */
    const handleDeleteConfirm =
        async () => {
            if (!deleteTarget?.id) {
                return;
            }

            try {
                setDeleteLoading(true);
                setError("");

                await deleteBanner(
                    deleteTarget.id,
                );

                setDeleteTarget(null);

                await fetchBanners();
            } catch (error) {
                console.error(
                    "Delete banner error:",
                    error,
                );

                setError(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Gagal menghapus banner",
                );
            } finally {
                setDeleteLoading(false);
            }
        };

    return (
        <div className="min-h-screen bg-base-200 px-5 py-8 md:px-8 md:py-10 lg:px-10">
            <div className="mx-auto max-w-7xl">
            
                <header className="mb-10 md:mb-14 lg:mb-13">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-primary mb-3">
                                Content Management
                            </p>

                            <h1 className="mt-3 font-[Philosopher] text-4xl leading-none tracking-tight md:text-5xl lg:text-6xl">
                                Banner
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/50">
                                Manage promotional banners displayed
                                across your storefront.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary gap-2 px-6 md:mb-10 lg:mb-12 "
                            onClick={() =>
                                handleCreate()
                            }
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                            />

                            Add Banner
                        </button>

                    </div>
                </header>
            
                {error && (
                    <div className="mb-8 border border-error/20 bg-error/5 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-error" />

                            <p className="text-xs text-error">
                                {error}
                            </p>
                        </div>
                    </div>
                )}
            
                <section>
                    <div className="mb-5">
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                            Overview
                        </p>
                    </div>

                    <BannerSummary
                        banners={banners}
                    />
                </section>
            
                <section className="mt-10 md:mt-12">
                    <div className="mb-5">
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                            Storefront
                        </p>
                    </div>

                    <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">

                        {/* FILTER HEADER */}
                        <div className="border-b border-base-300 p-5 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div>
                                    <h2 className="font-semibold">
                                        Storefront Banners
                                    </h2>

                                    <p className="mt-1 text-sm text-base-content/50">
                                        Manage banners by homepage
                                        slot and display order.
                                    </p>
                                </div>

                                <BannerFilter
                                    activeFilter={
                                        activeFilter
                                    }
                                    onChange={
                                        setActiveFilter
                                    }
                                />

                            </div>
                        </div>

                        {/* BANNER CONTENT */}
                        <div className="p-5 sm:p-6">

                            {loading ? (
                                <div className="flex min-h-[320px] items-center justify-center">
                                    <span className="loading loading-spinner loading-md text-primary" />
                                </div>
                            ) : (
                                <BannerTable
                                    banners={banners}
                                    activeFilter={
                                        activeFilter
                                    }
                                    onAdd={
                                        handleCreate
                                    }
                                    onEdit={
                                        handleEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                    onStatusChange={
                                        handleStatusChange
                                    }
                                />
                            )}

                        </div>
                    </div>
                </section>
            
                {modalOpen && (
                    <BannerForm
                        banner={
                            selectedBanner
                        }
                        onClose={
                            handleCloseModal
                        }
                        onSuccess={
                            handleSuccess
                        }
                    />
                )}
            
                <BannerDeleteModal
                    banner={
                        deleteTarget
                    }
                    loading={
                        deleteLoading
                    }
                    onClose={() => {
                        if (
                            !deleteLoading
                        ) {
                            setDeleteTarget(
                                null,
                            );
                        }
                    }}
                    onConfirm={
                        handleDeleteConfirm
                    }
                />

            </div>
        </div>
    );
};

export default Banner;
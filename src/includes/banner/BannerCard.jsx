import {
    faCheck,
    faEdit,
    faImage,
    faPowerOff,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    getBannerSlotLabel,
    getBannerStatusLabel,
} from "./BannerSlotOptions";

const BannerCard = ({
    position,
    slot,
    banner,
    onAdd,
    onEdit,
    onDelete,
    onStatusChange,
}) => {
    const desktopImage =
        banner?.images?.find(
            (image) =>
                image.device ===
                "DESKTOP",
        );

    const mobileImage =
        banner?.images?.find(
            (image) =>
                image.device ===
                "MOBILE",
        );

    const previewImage =
        desktopImage ??
        mobileImage ??
        null;

    const previewDevice =
        desktopImage
            ? "Desktop"
            : mobileImage
              ? "Mobile"
              : null;

    const isActive =
        banner?.status === "ACTIVE";

    /*
     * =========================
     * SLOT KOSONG
     * =========================
     */

    if (!banner) {
        return (
            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-dashed
                    border-base-300
                    bg-base-100
                "
            >
                {/* HEADER */}

                <div className="flex items-center gap-3 border-b border-base-300 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-base-200 font-bold">
                        {position}
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            {slot.label}
                        </h3>

                        <p className="text-xs text-base-content/40">
                            Slot:{" "}
                            {slot.value}
                        </p>
                    </div>
                </div>

                {/* EMPTY PREVIEW */}

                <div className="flex min-h-[220px] flex-col items-center justify-center bg-base-200/50 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100 text-base-content/20 shadow-sm">
                        <FontAwesomeIcon
                            icon={faImage}
                            className="text-2xl"
                        />
                    </div>

                    <h4 className="mt-4 font-semibold">
                        Slot kosong
                    </h4>

                    <p className="mt-1 text-sm text-base-content/50">
                        Belum ada banner
                        pada slot ini.
                    </p>
                </div>

                {/* ADD */}

                <div className="border-t border-base-300 p-4">
                    <button
                        type="button"
                        className="
                            btn
                            btn-sm
                            btn-outline
                            w-full
                        "
                        onClick={() =>
                            onAdd(
                                slot.value,
                            )
                        }
                    >
                        + Tambah Banner
                    </button>
                </div>
            </div>
        );
    }

    /*
     * =========================
     * BANNER ADA
     * =========================
     */

    return (
        <div
            className={`
                overflow-hidden
                rounded-2xl
                border
                bg-base-100
                shadow-sm
                ${
                    isActive
                        ? "border-base-300"
                        : "border-error/30"
                }
            `}
        >
            {/* =========================
                HEADER
                ========================= */}

            <div className="flex items-start justify-between gap-3 border-b border-base-300 p-4">
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-base-200
                            font-bold
                        "
                    >
                        {position}
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            {getBannerSlotLabel(
                                banner.slotKey,
                            )}
                        </h3>

                    </div>
                </div>

                {/* STATUS */}

                <span
                    className={`
                        badge
                        gap-1
                        ${
                            isActive
                                ? "badge-success"
                                : "badge-error"
                        }
                    `}
                >
                    <FontAwesomeIcon
                        icon={
                            isActive
                                ? faCheck
                                : faPowerOff
                        }
                    />

                    {getBannerStatusLabel(
                        banner.status,
                    )}
                </span>
            </div>

            {/* =========================
                IMAGE PREVIEW
                ========================= */}

            <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-base-200 p-2">
                {previewImage ? (
                    <>
                        <img
                            src={
                                previewImage.imageUrl
                            }
                            alt={`${banner.title} - ${previewDevice}`}
                            className="
                                max-h-80
                                w-full
                                object-contain
                            "
                        />

                        {!isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                                <span className="rounded-full bg-error px-4 py-2 text-sm font-bold text-white shadow-lg">
                                    INACTIVE
                                </span>
                            </div>
                        )}

                        <span className="absolute bottom-3 left-3 rounded-lg bg-base-100/90 px-2 py-1 text-xs font-medium shadow-sm">
                            {previewDevice}
                        </span>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <FontAwesomeIcon
                            icon={faImage}
                            className="text-3xl text-base-content/20"
                        />

                        <span className="mt-2 text-sm text-base-content/40">
                            No Image
                        </span>
                    </div>
                )}
            </div>

            {/* =========================
                INFORMATION
                ========================= */}

            <div className="space-y-3 p-4">
                <div>
                    <h3 className="font-semibold">
                        {banner.title}
                    </h3>

                    {banner.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-base-content/50">
                            {
                                banner.description
                            }
                        </p>
                    )}
                </div>

                {/* IMAGE DIMENSIONS */}

                <div className="flex flex-wrap gap-2 text-xs text-base-content/50">
                    {desktopImage && (
                        <span className="rounded-md bg-base-200 px-2 py-1">
                            Desktop:{" "}
                            {
                                desktopImage.width
                            }{" "}
                            ×{" "}
                            {
                                desktopImage.height
                            }
                        </span>
                    )}

                    {mobileImage && (
                        <span className="rounded-md bg-base-200 px-2 py-1">
                            Mobile:{" "}
                            {
                                mobileImage.width
                            }{" "}
                            ×{" "}
                            {
                                mobileImage.height
                            }
                        </span>
                    )}
                </div>

                {/* =========================
                    ACTIONS
                    ========================= */}

                <div className="flex flex-wrap gap-2 border-t border-base-300 pt-3">

                    {/* STATUS */}

                    <button
                        type="button"
                        onClick={() =>
                            onStatusChange(
                                banner,
                            )
                        }
                        className={`
                            btn
                            btn-sm
                            flex-1
                            border-none
                            text-white
                            ${
                                isActive
                                    ? "bg-error hover:bg-red-600"
                                    : "bg-green-600 hover:bg-green-700"
                            }
                        `}
                    >
                        <FontAwesomeIcon
                            icon={
                                isActive
                                    ? faPowerOff
                                    : faCheck
                            }
                        />

                        {isActive
                            ? "Deactivate"
                            : "Activate"}
                    </button>

                    {/* EDIT */}

                    <button
                        type="button"
                        onClick={() =>
                            onEdit(banner)
                        }
                        className="
                            btn
                            btn-sm
                            border-none
                            bg-primary
                            text-black
                            hover:bg-yellow-400
                        "
                    >
                        <FontAwesomeIcon
                            icon={faEdit}
                        />

                        Edit
                    </button>

                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={() =>
                            onDelete(banner)
                        }
                        className="
                            btn
                            btn-sm
                            border-none
                            bg-error
                            text-white
                            hover:bg-red-600
                        "
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                        />

                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
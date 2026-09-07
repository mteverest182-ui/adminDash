import { useEffect, useMemo, useState } from "react";
import {
    createBanner,
    updateBanner,
} from "../../api/banner.api";
import {
    BANNER_SLOT_OPTIONS,
    BANNER_STATUS_OPTIONS,
} from "./BannerSlotOptions";

const IMAGE_CONFIGS = [
    {
        key: "desktop",
        device: "DESKTOP",
        label: "Desktop",
        dimension: "1920 × 600",
    },
    {
        key: "mobile",
        device: "MOBILE",
        label: "Mobile",
        dimension: "750 × 500",
    },
];

const createInitialImages = () => ({
    desktop: null,
    mobile: null,
});

const formatDateTimeLocal = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const offset = date.getTimezoneOffset();
    const localDate = new Date(
        date.getTime() - offset * 60000,
    );

    return localDate.toISOString().slice(0, 16);
};

const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Gagal menyimpan banner";


const validateImageDimension = (
    file,
    expectedWidth,
    expectedHeight,
) => {
    return new Promise((resolve) => {
        if (!file) {
            resolve(false);
            return;
        }

        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        image.onload = () => {
            const isValid =
                image.width === expectedWidth &&
                image.height === expectedHeight;

            URL.revokeObjectURL(objectUrl);
            resolve(isValid);
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(false);
        };

        image.src = objectUrl;
    });
};    

const BannerForm = ({
    banner,
    onClose,
    onSuccess,
}) => {
    const isEditMode = Boolean(banner?.id);

    const [title, setTitle] = useState(
        banner?.title ?? "",
    );

    const [description, setDescription] = useState(
        banner?.description ?? "",
    );

    const [slotKey, setSlotKey] = useState(
        banner?.slotKey ?? "HERO",
    );

    const [status, setStatus] = useState(
        banner?.status ?? "INACTIVE",
    );

    const [linkUrl, setLinkUrl] = useState(
        banner?.linkUrl ?? "",
    );

    const [startAt, setStartAt] = useState(
        formatDateTimeLocal(banner?.startAt),
    );

    const [endAt, setEndAt] = useState(
        formatDateTimeLocal(banner?.endAt),
    );

    const [sortOrder, setSortOrder] = useState(
        banner?.sortOrder ?? 0,
    );

    const [images, setImages] = useState(
        createInitialImages,
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const existingImages = useMemo(() => {
        return Object.fromEntries(
            (banner?.images ?? []).map((image) => [
                image.device,
                image,
            ]),
        );
    }, [banner?.images]);

    useEffect(() => {
        setTitle(banner?.title ?? "");

        setDescription(
            banner?.description ?? "",
        );

        setSlotKey(
            banner?.slotKey ?? "HERO",
        );

        setStatus(
            banner?.status ?? "INACTIVE",
        );

        setLinkUrl(
            banner?.linkUrl ?? "",
        );

        setStartAt(
            formatDateTimeLocal(
                banner?.startAt,
            ),
        );

        setEndAt(
            formatDateTimeLocal(
                banner?.endAt,
            ),
        );

        setSortOrder(
            banner?.sortOrder ?? 0,
        );

        setImages(createInitialImages());
        setError("");
    }, [banner]);

    const handleImageChange = (
        key,
        file,
    ) => {
        setImages((current) => ({
            ...current,
            [key]: file,
        }));
    };

    const buildFormData = () => {
        const form = new FormData();

        form.append(
            "title",
            title.trim(),
        );

        form.append(
            "description",
            description.trim(),
        );

        form.append(
            "slotKey",
            slotKey,
        );

        form.append(
            "status",
            status,
        );

        form.append(
            "linkUrl",
            linkUrl.trim(),
        );

        form.append(
            "sortOrder",
            String(sortOrder),
        );

        if (startAt) {
            form.append(
                "startAt",
                startAt,
            );
        }

        if (endAt) {
            form.append(
                "endAt",
                endAt,
            );
        }

        if (images.desktop) {
            form.append(
                "desktop",
                images.desktop,
            );
        }

        if (images.mobile) {
            form.append(
                "mobile",
                images.mobile,
            );
        }

        return form;
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        setError("");

        const trimmedTitle =
            title.trim();

        if (!trimmedTitle) {
            setError(
                "Title banner wajib diisi",
            );
            return;
        }

        if (!slotKey) {
            setError(
                "Banner slot wajib dipilih",
            );
            return;
        }

        if (
            startAt &&
            endAt &&
            new Date(startAt) >=
                new Date(endAt)
        ) {
            setError(
                "End date harus lebih besar dari start date",
            );
            return;
        }

        if (!isEditMode) {
            if (slotKey === "HERO") {
                if (!images.desktop) {
                    setError(
                        "Gambar Desktop wajib diupload untuk Hero Banner",
                    );
                    return;
                }

                if (!images.mobile) {
                    setError(
                        "Gambar Mobile wajib diupload untuk Hero Banner",
                    );
                    return;
                }
            } else {
                if (
                    !images.desktop &&
                    !images.mobile
                ) {
                    setError(
                        "Minimal satu gambar banner harus diupload",
                    );
                    return;
                }
            }
        }

        try {
            setLoading(true);

            const formData =
                buildFormData();

            console.log(
                "SAVE BANNER:",
                {
                    mode: isEditMode
                        ? "UPDATE"
                        : "CREATE",
                    title: title.trim(),
                    slotKey,
                    status,
                    desktop:
                        images.desktop?.name ??
                        null,
                    mobile:
                        images.mobile?.name ??
                        null,
                },
            );

            if (isEditMode) {
                await updateBanner(
                    banner.id,
                    formData,
                );
            } else {
                await createBanner(
                    formData,
                );
            }

            await onSuccess();
        } catch (error) {
            console.error(
                "SAVE BANNER ERROR:",
                error,
            );

            setError(
                getErrorMessage(error),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-base-100 shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-100 p-5">
                    <div>
                        <h2 className="text-lg font-bold">
                            {isEditMode
                                ? "Edit Banner"
                                : "Add Banner"}
                        </h2>

                        <p className="mt-1 text-sm text-base-content/50">
                            {isEditMode
                                ? "Update informasi dan gambar banner."
                                : "Tambahkan banner baru ke storefront."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5"
                >
                    {error && (
                        <div className="alert alert-error">
                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    <div>
                        <label
                            className="label"
                            htmlFor="banner-title"
                        >
                            <span className="label-text">
                                Title
                            </span>
                        </label>

                        <input
                            id="banner-title"
                            type="text"
                            className="input input-bordered w-full"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value,
                                )
                            }
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label
                            className="label"
                            htmlFor="banner-description"
                        >
                            <span className="label-text">
                                Description
                            </span>
                        </label>

                        <textarea
                            id="banner-description"
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value,
                                )
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label
                                className="label"
                                htmlFor="banner-slot"
                            >
                                <span className="label-text">
                                    Slot
                                </span>
                            </label>

                            <select
                                id="banner-slot"
                                className="select select-bordered w-full"
                                value={slotKey}
                                onChange={(event) =>
                                    setSlotKey(
                                        event.target.value,
                                    )
                                }
                                disabled={loading}
                                required
                            >
                                <option value="">
                                    Select Banner Slot
                                </option>

                                {BANNER_SLOT_OPTIONS.map(
                                    (slot) => (
                                        <option
                                            key={
                                                slot.value
                                            }
                                            value={
                                                slot.value
                                            }
                                        >
                                            {
                                                slot.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label
                                className="label"
                                htmlFor="banner-status"
                            >
                                <span className="label-text">
                                    Status
                                </span>
                            </label>

                            <select
                                id="banner-status"
                                className="select select-bordered w-full"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value,
                                    )
                                }
                                disabled={loading}
                            >
                                {BANNER_STATUS_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 font-semibold">
                            Banner Images
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            {IMAGE_CONFIGS.map(
                                (config) => (
                                    <ImageUpload
                                        key={
                                            config.key
                                        }
                                        device={
                                            config.device
                                        }
                                        label={
                                            config.label
                                        }
                                        dimension={
                                            config.dimension
                                        }
                                        value={
                                            images[
                                                config.key
                                            ]
                                        }
                                        existingImage={
                                            existingImages[
                                                config.device
                                            ]
                                        }
                                        onChange={(
                                            file,
                                        ) =>
                                            handleImageChange(
                                                config.key,
                                                file,
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                    />
                                ),
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            className="label"
                            htmlFor="banner-link"
                        >
                            <span className="label-text">
                                Link URL
                            </span>
                        </label>

                        <input
                            id="banner-link"
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="/shop"
                            value={linkUrl}
                            onChange={(event) =>
                                setLinkUrl(
                                    event.target.value,
                                )
                            }
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-base-300 pt-5">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                  ? "Update Banner"
                                  : "Create Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ImageUpload = ({
    device,
    label,
    dimension,
    value,
    existingImage,
    onChange,
    disabled,
}) => {
    const [previewUrl, setPreviewUrl] =
        useState(
            existingImage?.imageUrl ?? null,
        );

    useEffect(() => {
        if (!value) {
            setPreviewUrl(
                existingImage?.imageUrl ?? null,
            );

            return undefined;
        }

        const objectUrl =
            URL.createObjectURL(value);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [
        value,
        existingImage?.imageUrl,
    ]);

    const handleRemove = () => {
        onChange(null);
    };

    return (
        <div className="rounded-xl border border-base-300 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="font-medium">
                        {label}
                    </p>

                    <p className="text-xs text-base-content/50">
                        {device} · Recommended:{" "}
                        {dimension}
                    </p>
                </div>

                {previewUrl && (
                    <button
                        type="button"
                        className="btn btn-xs btn-error btn-outline"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        Remove
                    </button>
                )}
            </div>

            {previewUrl ? (
                <div className="relative mb-3 overflow-hidden rounded-lg bg-base-200">
                    <img
                        src={previewUrl}
                        alt={`${label} preview`}
                        className="h-40 w-full object-cover"
                    />

                    {value && (
                        <div className="absolute bottom-2 left-2 rounded-md bg-base-100/90 px-2 py-1 text-xs">
                            New image
                        </div>
                    )}

                    {!value &&
                        existingImage && (
                            <div className="absolute bottom-2 left-2 rounded-md bg-base-100/90 px-2 py-1 text-xs">
                                Existing image
                            </div>
                        )}
                </div>
            ) : (
                <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-base-200">
                    <span className="text-sm text-base-content/40">
                        No image selected
                    </span>
                </div>
            )}

            {existingImage && !value && (
                <p className="mb-3 text-xs text-base-content/50">
                    Existing image will be kept
                    unless you select a new
                    image.
                </p>
            )}

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="file-input file-input-bordered w-full"
                onChange={(event) => {
                    const file =
                        event.target.files?.[0] ??
                        null;

                    onChange(file);

                    /*
                     * Reset input supaya file yang sama
                     * bisa dipilih kembali setelah Remove.
                     */
                    event.target.value = "";
                }}
                disabled={disabled}
            />

            {value && (
                <p className="mt-2 truncate text-xs text-base-content/50">
                    {value.name}
                </p>
            )}
        </div>
    );
};


export default BannerForm;

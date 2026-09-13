import { BANNER_SLOT_OPTIONS } from "./BannerSlotOptions";

import BannerCard from "./BannerCard";

const getBannerBySlot = (
    banners,
    slotKey,
) => {
    return (
        banners.find(
            (banner) =>
                banner.slotKey ===
                slotKey,
        ) ?? null
    );
};

const BannerTable = ({
    banners = [],
    activeFilter = "ALL",
    onAdd,
    onEdit,
    onDelete,
    onStatusChange,
}) => {
    if (activeFilter !== "ALL") {
        const slot =
            BANNER_SLOT_OPTIONS.find(
                (item) =>
                    item.value ===
                    activeFilter,
            );

        const banner =
            getBannerBySlot(
                banners,
                activeFilter,
            );

        if (!slot) {
            return null;
        }

        if (!banner) {
            return (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/40 px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-2xl text-base-content/30">
                        +
                    </div>

                    <h3 className="mt-4 font-semibold">
                        Belum ada banner
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-base-content/50">
                        Slot{" "}
                        <span className="font-medium text-base-content">
                            {slot.label}
                        </span>{" "}
                        belum memiliki banner.
                    </p>

                    <button
                        type="button"
                        className="btn btn-sm btn-primary mt-4"
                        onClick={() =>
                            onAdd(
                                slot.value,
                            )
                        }
                    >
                        + Tambah Banner
                    </button>
                </div>
            );
        }
        return (
            <div className="mx-auto max-w-3xl">
                <BannerCard
                    banner={banner}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={
                        onStatusChange
                    }
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                {renderSlot(
                    BANNER_SLOT_OPTIONS[0],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {renderSlot(
                    BANNER_SLOT_OPTIONS[1],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}

                {renderSlot(
                    BANNER_SLOT_OPTIONS[2],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {renderSlot(
                    BANNER_SLOT_OPTIONS[3],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}

                {renderSlot(
                    BANNER_SLOT_OPTIONS[4],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {renderSlot(
                    BANNER_SLOT_OPTIONS[5],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}

                {renderSlot(
                    BANNER_SLOT_OPTIONS[6],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}

                {renderSlot(
                    BANNER_SLOT_OPTIONS[7],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}

                {renderSlot(
                    BANNER_SLOT_OPTIONS[8],
                    banners,
                    onAdd,
                    onEdit,
                    onDelete,
                    onStatusChange,
                )}
            </div>
        </div>
    );
};

const renderSlot = (
    slot,
    banners,
    onAdd,
    onEdit,
    onDelete,
    onStatusChange,
) => {
    const banner =
        getBannerBySlot(
            banners,
            slot.value,
        );

    const position =
        BANNER_SLOT_OPTIONS.indexOf(
            slot,
        ) + 1;

    return (
        <BannerCard
            key={slot.value}
            position={position}
            slot={slot}
            banner={banner}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
                onStatusChange
            }
        />
    );
};

export default BannerTable;
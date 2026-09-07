export const BANNER_SLOT_OPTIONS = [
    {
        value: "HERO",
        label: "Hero",
    },
    {
        value: "SECONDARY_LEFT",
        label: "Secondary Left",
    },
    {
        value: "SECONDARY_RIGHT",
        label: "Secondary Right",
    },
    {
        value: "MOBILE_FEATURED_1",
        label: "Mobile Featured 1",
    },
    {
        value: "MOBILE_FEATURED_2",
        label: "Mobile Featured 2",
    },
    {
        value: "PROMO_1",
        label: "Promo 1",
    },
    {
        value: "PROMO_2",
        label: "Promo 2",
    },
    {
        value: "PROMO_3",
        label: "Promo 3",
    },
    {
        value: "PROMO_4",
        label: "Promo 4",
    },
];

export const BANNER_STATUS_OPTIONS = [
    {
        value: "ACTIVE",
        label: "Active",
    },
    {
        value: "INACTIVE",
        label: "Inactive",
    },
];

export const getBannerSlotLabel = (slotKey) => {
    return (
        BANNER_SLOT_OPTIONS.find(
            (item) => item.value === slotKey,
        )?.label || slotKey
    );
};

export const getBannerStatusLabel = (status) => {
    return (
        BANNER_STATUS_OPTIONS.find(
            (item) => item.value === status,
        )?.label || status
    );
};
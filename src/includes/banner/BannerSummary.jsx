import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faLayerGroup,
    faCircleCheck,
    faImage,
    faCircleXmark,
}from "@fortawesome/free-solid-svg-icons"

const BannerSummary = ({
    banners = [],
}) => {
    const total = banners.length;

    const active = banners.filter(
        (banner) =>
            banner.status === "ACTIVE",
    ).length;

    const inactive = banners.filter(
        (banner) =>
            banner.status === "INACTIVE",
    ).length;

    const hero = banners.filter(
        (banner) =>
            banner.slotKey === "HERO",
    ).length;

    const cards = [ 
        {
            label: "Total Banners",
            value: total,
            icon: faLayerGroup,
        },
        {
            label: "Active",
            value: active,
            icon: faCircleCheck,
        },
        {
            label: "Inactive",
            value: inactive,
            icon: faCircleXmark,
        },
        {
            label: "Hero",
            value: hero,
            icon: faImage,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-base-content/40">
                                {card.label}
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                                {card.value}
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
                            <FontAwesomeIcon
                                icon={
                                    card.icon
                                }
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BannerSummary


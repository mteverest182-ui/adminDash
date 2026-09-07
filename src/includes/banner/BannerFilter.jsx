import { BANNER_SLOT_OPTIONS } from "./BannerSlotOptions";

const BannerFilter = ({
    activeFilter,
    onChange,
}) => {
    const filters = [
        {
            value: "ALL",
            label: "All",
        },
        ...BANNER_SLOT_OPTIONS,
    ];

    return (
        <div
            role="tablist"
            aria-label="Banner slot filter"
            className="flex w-full flex-wrap gap-2 lg:w-auto"
        >
            {filters.map((filter) => {
                const isActive =
                    activeFilter === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() =>
                            onChange(filter.value)
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                            isActive
                                ? "bg-primary text-primary-content shadow-sm"
                                : "bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content"
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
};

export default BannerFilter;
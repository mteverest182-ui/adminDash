import useWhatsappSetting from "../../api/whatsapp.api";

const WhatsappSetting = () => {
  const {
    whatsappUrl,
    setWhatsappUrl,
    savedWhatsappUrl,
    orderChannel,
    whatsappLoading,
    whatsappSaving,
    whatsappMessage,
    whatsappMessageType,
    handleSaveWhatsapp,
    handleDeleteWhatsapp,
  } = useWhatsappSetting();

  const channelLabel =
    orderChannel === "whatsapp"
      ? "WhatsApp"
      : orderChannel === "external"
        ? "External"
        : null;

  return (
    <div className="border border-base-300/60 bg-base-100">
      <div className="p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-primary">
              Order Channel
            </p>

            <h2 className="mt-2 font-[Philosopher] text-2xl tracking-tight md:text-3xl">
              Order URL
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/50">
              Atur URL yang digunakan pelanggan untuk melakukan pemesanan
              produk. URL dapat berupa WhatsApp langsung, shortlink yang
              mengarah ke WhatsApp, atau URL external lainnya.
            </p>
          </div>

          {/* STATUS */}
          <div className="shrink-0">
            {whatsappLoading ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-xs text-primary" />

                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-base-content/40">
                  Loading
                </span>
              </div>
            ) : savedWhatsappUrl ? (
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />

                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-success">
                  Active
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />

                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-warning">
                  Not Configured
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-7 h-px bg-base-300/60" />

        {/* FORM */}
        <div>
          <label className="mb-2 block">
            <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-base-content/40">
              Order URL
            </span>
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="url"
              value={whatsappUrl}
              onChange={(e) => setWhatsappUrl(e.target.value)}
              placeholder="https://wa.me/6281234567890"
              className="input input-bordered w-full bg-base-100 md:flex-1"
              disabled={whatsappLoading || whatsappSaving}
            />

            <button
              type="button"
              className="btn btn-primary px-8 md:w-auto"
              onClick={handleSaveWhatsapp}
              disabled={whatsappLoading || whatsappSaving}
            >
              {whatsappSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>

          <p className="mt-2 text-[10px] leading-relaxed text-base-content/35">
            Contoh WhatsApp:
            {" "}
            https://wa.me/6281234567890
            {" "}
            atau gunakan shortlink yang mengarah ke WhatsApp.
          </p>
        </div>

        {/* MESSAGE */}
        {whatsappMessage && (
          <div
            className={`mt-5 border px-4 py-3 ${
              whatsappMessageType === "error"
                ? "border-error/20 bg-error/5"
                : "border-success/20 bg-success/5"
            }`}
          >
            <p
              className={`text-xs ${
                whatsappMessageType === "error"
                  ? "text-error"
                  : "text-success"
              }`}
            >
              {whatsappMessage}
            </p>
          </div>
        )}

        {/* ACTIVE CONFIGURATION */}
        {!whatsappLoading && savedWhatsappUrl && (
          <div className="mt-7">
            <div className="flex flex-col gap-5 border border-base-300/60 bg-base-200/30 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-base-content/40">
                    Active Order URL
                  </p>

                  <p className="mt-2 break-all text-sm font-medium tracking-wide text-base-content/80">
                    {savedWhatsappUrl}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm shrink-0 px-4 text-error hover:bg-error/10"
                  onClick={handleDeleteWhatsapp}
                  disabled={whatsappSaving}
                >
                  {whatsappSaving ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>

              {/* DETECTED CHANNEL */}
              <div className="border-t border-base-300/60 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-base-content/40">
                      Detected Channel
                    </p>

                    <p className="mt-1 text-xs text-base-content/50">
                      Channel ini digunakan frontend untuk menentukan
                      cara membuka Order URL.
                    </p>
                  </div>

                  {orderChannel === "whatsapp" ? (
                    <span className="badge badge-success badge-outline">
                      WhatsApp
                    </span>
                  ) : orderChannel === "external" ? (
                    <span className="badge badge-neutral badge-outline">
                      External
                    </span>
                  ) : (
                    <span className="badge badge-warning badge-outline">
                      Unknown
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!whatsappLoading && !savedWhatsappUrl && !whatsappMessage && (
          <div className="mt-7 border border-warning/20 bg-warning/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />

              <p className="text-xs leading-relaxed text-base-content/50">
                Order URL belum dikonfigurasi. Simpan URL untuk
                mengaktifkan channel pemesanan pelanggan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsappSetting;
const BannerDeleteModal = ({
    banner,
    loading,
    onClose,
    onConfirm,
}) => {
    if (!banner) {
        return null;
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="text-lg font-bold">
                    Konfirmasi Hapus
                </h3>

                <p className="py-4 text-sm text-base-content/70">
                    Apakah kamu yakin ingin menghapus banner{" "}
                    <span className="font-semibold text-base-content">
                        {banner.title}
                    </span>
                    ?
                </p>

                <div className="modal-action">
                    <button
                        type="button"
                        className="btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-error"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Menghapus...
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerDeleteModal;

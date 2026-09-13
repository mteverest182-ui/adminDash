import { useEffect, useState } from "react";
import {
  getWhatsappSetting,
  updateWhatsappSetting,
  deleteWhatsappSetting,
} from "../api/dashboard.api";

const useWhatsappSetting = () => {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [savedWhatsappUrl, setSavedWhatsappUrl] = useState("");

  const [orderChannel, setOrderChannel] = useState(null);

  const [whatsappLoading, setWhatsappLoading] = useState(true);
  const [whatsappSaving, setWhatsappSaving] = useState(false);

  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [whatsappMessageType, setWhatsappMessageType] =
    useState("success");

  const loadWhatsappSetting = async () => {
    try {
      setWhatsappLoading(true);
      setWhatsappMessage("");
      const response = await getWhatsappSetting();
      const url = response.data?.whatsappUrl || "";
      const channel = response.data?.orderChannel || null;

      setWhatsappUrl(url);
      setSavedWhatsappUrl(url);
      setOrderChannel(channel);
    } catch (error) {
      setWhatsappMessage(
        error.response?.data?.message
      );

      setWhatsappMessageType("error");
    } finally {
      setWhatsappLoading(false);
    }
  };

  useEffect(() => {
    loadWhatsappSetting();
  }, []);

  const handleSaveWhatsapp = async () => {
    const url = whatsappUrl.trim();

    if (!url) {
      setWhatsappMessage("URL wajib diisi");
      setWhatsappMessageType("error");
      return;
    }

    try {
      setWhatsappSaving(true);
      setWhatsappMessage("");

      const response = await updateWhatsappSetting(url);

      const savedUrl =
        response.data?.whatsappUrl || url;

      const channel =
        response.data?.orderChannel || null;

      setWhatsappUrl(savedUrl);
      setSavedWhatsappUrl(savedUrl);
      setOrderChannel(channel);

      if (channel === "whatsapp") {
        setWhatsappMessage(
          "URL berhasil disimpan dan terdeteksi sebagai WhatsApp.",
        );
      } else {
        setWhatsappMessage(
          "URL berhasil disimpan sebagai external order URL.",
        );
      }

      setWhatsappMessageType("success");
    } catch (error) {
      console.error(
        error,
      );

      setWhatsappMessage(
        error.response?.data?.message
      );

      setWhatsappMessageType("error");
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleDeleteWhatsapp = async () => {
    try {
      setWhatsappSaving(true);
      setWhatsappMessage("");

      const response = await deleteWhatsappSetting();


      setWhatsappUrl("");
      setSavedWhatsappUrl("");
      setOrderChannel(null);

      setWhatsappMessage(
        "Order URL berhasil dihapus",
      );

      setWhatsappMessageType("success");
    } catch (error) {
      console.error(
        error,
      );

      setWhatsappMessage(
        error.response?.data?.message ||
          "Gagal menghapus Order URL",
      );

      setWhatsappMessageType("error");
    } finally {
      setWhatsappSaving(false);
    }
  };

  return {
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
  };
};

export default useWhatsappSetting;
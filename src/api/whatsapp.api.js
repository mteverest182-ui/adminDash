import { useEffect, useState } from "react";
import {
  getWhatsappSetting,
  updateWhatsappSetting,
  deleteWhatsappSetting,
} from "../api/dashboard.api";

const useWhatsappSetting = () => {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [savedWhatsappUrl, setSavedWhatsappUrl] = useState("");

  const [whatsappLoading, setWhatsappLoading] = useState(true);
  const [whatsappSaving, setWhatsappSaving] = useState(false);

  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [whatsappMessageType, setWhatsappMessageType] = useState("success");

  const loadWhatsappSetting = async () => {
    try {
      setWhatsappLoading(true);
      setWhatsappMessage("");

      const response = await getWhatsappSetting();

      console.log("WHATSAPP SETTING:", response);

      const url = response.data?.whatsappUrl || "";

      setWhatsappUrl(url);
      setSavedWhatsappUrl(url);
    } catch (error) {
      console.error("GET WHATSAPP SETTING ERROR:", error);

      setWhatsappMessage(
        error.response?.data?.message || "Gagal mengambil WhatsApp URL",
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
      setWhatsappMessage("URL WhatsApp wajib diisi");
      setWhatsappMessageType("error");
      return;
    }

    try {
      setWhatsappSaving(true);
      setWhatsappMessage("");

      const response = await updateWhatsappSetting(url);

      console.log("UPDATE WHATSAPP:", response);

      setWhatsappUrl(url);
      setSavedWhatsappUrl(url);

      setWhatsappMessage("WhatsApp URL berhasil disimpan");

      setWhatsappMessageType("success");
    } catch (error) {
      console.error("UPDATE WHATSAPP ERROR:", error);

      setWhatsappMessage(
        error.response?.data?.message || "Gagal menyimpan WhatsApp URL",
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

      console.log("DELETE WHATSAPP:", response);

      setWhatsappUrl("");
      setSavedWhatsappUrl("");

      setWhatsappMessage("WhatsApp URL berhasil dihapus");

      setWhatsappMessageType("success");
    } catch (error) {
      console.error("DELETE WHATSAPP ERROR:", error);

      setWhatsappMessage(
        error.response?.data?.message || "Gagal menghapus WhatsApp URL",
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

    whatsappLoading,
    whatsappSaving,

    whatsappMessage,
    whatsappMessageType,

    handleSaveWhatsapp,
    handleDeleteWhatsapp,
  };
};

export default useWhatsappSetting;

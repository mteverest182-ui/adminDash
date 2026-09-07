import { useEffect } from "react";
import { logout } from "../api/auth.api";

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("LOGOUT ERROR:", error);
      } finally {
        window.location.replace("/SignIn");
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg" />

        <p className="text-sm text-base-content/70">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;

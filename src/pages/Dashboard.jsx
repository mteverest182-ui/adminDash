import { useEffect, useState } from "react";
import { useAuthStore } from "../api/auth.store";
import { getDashboardData } from "../api/dashboard.api";
import WhatsappSetting from "../includes/whatsapp/WhatsappSetting"
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardData();

        setStats(
          response.data ?? {
            totalProducts: 0,
            totalCategories: 0,
            totalUsers: 0,
          },
        );
      } catch (error) {
        console.error("GET DASHBOARD STATS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Gagal mengambil data dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-5 py-8 md:px-8 md:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <header className="mb-10 md:mb-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-primary">
                Overview
              </p>

              <h1 className="mt-3 font-[Philosopher] text-4xl leading-none tracking-tight md:text-5xl lg:text-6xl">
                Dashboard
              </h1>

              <p className="mt-4 text-sm text-base-content/50">
                Selamat datang,{" "}
                <span className="font-medium text-base-content/80 ">
                  {user?.username || "-"}
                </span>
              </p>
            </div>

            <div className="hidden md:block">
              <p className="text-right text-[10px] uppercase tracking-[0.3em] text-base-content/30">
                Admin Overview
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 border border-error/20 bg-error/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-error" />

              <p className="text-xs text-error">
                {error}
              </p>
            </div>
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
              Statistics
            </p>

            <p className="text-[9px] uppercase tracking-[0.25em] text-base-content/25">
              Current Overview
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-base-300/60 bg-base-300/60 md:grid-cols-3">

            <Link to={"/products"}>
            <div className="group bg-base-100 p-6 transition-colors duration-300 hover:bg-base-200/50 md:p-8 lg:p-9">
              <div className="flex items-start justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                  Products
                </p>

                <span className="text-[9px] tracking-[0.25em] text-primary/60">
                  01
                </span>
              </div>

              <div className="mt-10">
                {loading ? (
                  <span className="loading loading-spinner loading-sm text-primary" />
                ) : (
                  <p className="font-[Philosopher] text-5xl leading-none tracking-tight md:text-6xl">
                    {stats.totalProducts}
                  </p>
                )}

                <div className="mt-5 h-px w-8 bg-primary/40 transition-all duration-500 group-hover:w-14" />

                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-base-content/35">
                  Total products
                </p>
              </div>
            </div>
            </Link>

            <Link to={"/categories"}>
            <div className="group bg-base-100 p-6 transition-colors duration-300 hover:bg-base-200/50 md:p-8 lg:p-9">
              <div className="flex items-start justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                  Categories
                </p>

                <span className="text-[9px] tracking-[0.25em] text-primary/60">
                  02
                </span>
              </div>

              <div className="mt-10">
                {loading ? (
                  <span className="loading loading-spinner loading-sm text-primary" />
                ) : (
                  <p className="font-[Philosopher] text-5xl leading-none tracking-tight md:text-6xl">
                    {stats.totalCategories}
                  </p>
                )}

                <div className="mt-5 h-px w-8 bg-primary/40 transition-all duration-500 group-hover:w-14" />

                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-base-content/35">
                  Total categories
                </p>
              </div>
            </div>
            </Link>

            <Link to={"/users"}>
            <div className="group bg-base-100 p-6 transition-colors duration-300 hover:bg-base-200/50 md:p-8 lg:p-9">
              <div className="flex items-start justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
                  Users
                </p>

                <span className="text-[9px] tracking-[0.25em] text-primary/60">
                  03
                </span>
              </div>
              
              <div className="mt-10">
                {loading ? (
                  <span className="loading loading-spinner loading-sm text-primary" />
                ) : (
                  <p className="font-[Philosopher] text-5xl leading-none tracking-tight md:text-6xl">
                    {stats.totalUsers}
                  </p>
                )}

                <div className="mt-5 h-px w-8 bg-primary/40 transition-all duration-500 group-hover:w-14" />

                <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-base-content/35">
                  Total users
                </p>
              </div>
            </div>
            </Link>
          </div>
        </section>

        <section className="mt-10 md:mt-12">
          <div className="mb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
              Account
            </p>
          </div>

          <div className="border border-base-300/60 bg-base-100 p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <h2 className="font-[Philosopher] text-2xl tracking-tight md:text-3xl">
                Account Information
              </h2>

              <div className="mt-3 h-px w-10 bg-primary/50" />
            </div>

            <div className="flex justify-between gap-8 sm:grid-cols-2 ">

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-base-content/40">
                  Username
                </p>

                <p className="mt-3 text-sm font-medium tracking-wide text-base-content">
                  {user?.username || "-"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-base-content/40">
                  Role
                </p>

                <div>
                  <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-primary">
                    {user?.role?.replace("_", " ") || "-"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="mt-10 md:mt-12">
          <div className="mb-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-base-content/40">
              Configuration
            </p>
          </div>

          <WhatsappSetting/>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  faGaugeHigh,
  faBox,
  faUsers,
  faRightFromBracket,
  faBars,
  faXmark,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useEscapeKey from "../features/useEscapeKey";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const menuClass = ({ isActive }) =>
    `
      flex items-center gap-3 rounded-lg px-4 py-3
      transition-colors
      justify-start
      md:justify-center
      lg:justify-start
      w-full
      px-4 py-3
      rounded-lg
      text-sm font-medium
      transition-all duration-200

      ${
        isActive
          ? "bg-primary text-primary-content shadow-sm"
          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
      }

      md:justify-center
      md:px-2

      lg:justify-start
      lg:px-4
  `;

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  useEscapeKey(closeSidebar, sidebarOpen);

  return (
    <div className="min-h-screen bg-base-200">
      {/* =========================================
          HEADER
      ========================================= */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-base-300 bg-base-100">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Hamburger - MOBILE ONLY */}
            <button
              type="button"
              className="btn btn-square btn-ghost md:hidden"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label={sidebarOpen ? "close sidebar" : "Open Sidebar"}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Brand */}
            <h1 className="text-base font-bold tracking-tight sm:text-lg">
              Product Management
            </h1>
          </div>

          {/* Admin */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin</p>

              <p className="text-xs text-base-content/50">Administrator</p>
            </div>

            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="w-9 rounded-full bg-primary text-primary-content">
                <span className="flex justify-center text-sm font-semibold pt-1">
                  A
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
      {sidebarOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/40
            md:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`
          fixed
          left-0
          top-16
          z-40

          h-[calc(100vh-4rem)]

          border-r
          border-base-300
          bg-base-100

          transition-all
          duration-300
          ease-in-out

          /* MOBILE < 768px */
          w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

          /* TABLET >= 768px */
          md:translate-x-0
          md:w-20

          /* DESKTOP >= 1024px */
          lg:w-64
        `}
      >
        <div className="flex h-full flex-col">
          {/* =====================================
              SIDEBAR HEADER
          ===================================== */}
          <div className="flex h-14 shrink-0 items-center justify-end px-3 lg:hidden">
            <button
              type="button"
              className="btn btn-sm btn-square btn-ghost hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {/* =====================================
              NAVIGATION
          ===================================== */}

          <nav className="flex-1 overflow-y-auto mt-2">
            {/* Menu Label */}
            <p
              className="
                mb-1
                px-4
                text-xs
                font-semibold
                uppercase 
                tracking-wider
                text-base-content/40
                text-left
                md:px-0
                md:text-center
                lg:px-4
                lg:text-left
              "
            >
              {/* Desktop */}
              <span className="md:hidden lg:inline">Menu</span>
              {/* Tablet */}
            </p>

            <ul className="space-y-1">
              {/* Dashboard */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={menuClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FontAwesomeIcon
                    icon={faGaugeHigh}
                    className="w-4 shrink-0"
                  />

                  <span className="md:hidden lg:inline">Dashboard</span>
                </NavLink>
              </li>


                <li>
                  <NavLink
                    to="/banners"
                    className={menuClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faImages}
                      className="w-4 shrink-0"
                    />

                    <span className="md:hidden lg:inline">
                      Banner Management
                    </span>
                  </NavLink>
                </li>


              {/* Products */}

              <li>
                {/* Products Header */}
                <button
                  type="button"
                  aria-expanded={productsOpen}
                  aria-controls="products-submenu"
                  onClick={() => setProductsOpen((open) => !open)}
                  className="
                flex
                items-center
                rounded-lg
                px-4
                py-3
                w-full
                text-sm
                font-medium
                text-base-content/70
                transition-all
                duration-200
                hover:bg-base-200
                hover:text-base-content
                md:justify-center
                md:px-2

                lg:justify-start
                lg:px-4
                "
                >
                  <FontAwesomeIcon icon={faBox} className="w-4 shrink-0" />
                  <span className="md:hidden lg:inline flex-1 text-left">
                    Products
                  </span>
                </button>

                {/* Products Dropdown */}
                {productsOpen && (
                  <ul className="mt-1 space-y-1 lg:pl-4">
                    <li>
                      <NavLink
                        to="/products"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `
                        flex items-center rounded-lg px-4 py-2.5 text-sm transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                        }

                        md:justify-center
                        md:px-2

                        lg:justify-start
                        lg:px-4
                      `
                        }
                      >
                        <span className="md:hidden lg:inline">
                          All Products
                        </span>

                        <span className="hidden md:inline lg:hidden">P</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/categories"
                        onClick={() => setSidebarOpen((open) => !open)}
                        className={({ isActive }) =>
                          `
                        flex items-center roundend-lg px-4 py-2.5 text-sm transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                        }

                        md:justify-center
                        md:px-2
                        lg:justify-start
                        lg:px-4
                      `
                        }
                      >
                        <span className="md:hidden lg:inline">Categories</span>
                        <span className="hidden md:inline lg:hidden ">C</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Users */}
              <li>
                <NavLink
                  to="/users"
                  className={menuClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faUsers} className="w-4 shrink-0" />

                  <span className="md:hidden lg:inline">User Management</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* =====================================
              LOGOUT
          ===================================== */}
          <div
            className="
              shrink-0
              border-t
              border-base-300
              p-3

              md:px-2
              lg:px-3
            "
          >
            <Link
              to="/logout"
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-sm
                font-medium
                text-error
                transition-colors
                hover:bg-error/10

                md:justify-center
                md:px-2

                lg:justify-start
                lg:px-4
                cursor-pointer
              "
            >
              <button type="button">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="w-4 shrink-0"
                />

                <span className="md:hidden lg:inline">Logout</span>
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* =========================================
          MAIN CONTENT
      ========================================= */}
      <main
        className="
          min-h-screen
          pt-16

          transition-all
          duration-300

          /* MOBILE */
          ml-0

          /* TABLET */
          md:ml-20

          /* DESKTOP */
          lg:ml-64
        "
      >
        <div className="w-full p-4 sm:p-5 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default AdminLayout;

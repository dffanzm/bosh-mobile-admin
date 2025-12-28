import React, { useState } from "react";
import {
  FiPackage,
  FiImage,
  FiMenu,
  FiLogOut,
  FiUser,
  FiStar,
  FiUsers, // <--- 1. Import Icon Users
} from "react-icons/fi";

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  children,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 2. Tambah Menu 'Developers'
  const menuItems = [
    { id: "products", label: "Products", icon: FiPackage },
    { id: "featured", label: "Featured", icon: FiStar },
    { id: "banners", label: "Banners", icon: FiImage },
    { id: "developers", label: "Developers", icon: FiUsers }, // <--- Menu Baru
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ... (SISA CODE SAMA PERSIS, GAK PERLU DIUBAH) ... */}

      {/* Mobile Overlay & Sidebar Code tetep sama... */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          flex flex-col justify-between
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo & Nav Section */}
        <div>
          <div className="h-20 flex items-center px-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">
                B
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide">BOSH</h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                    `}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-white transition-colors"
                    }
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User / Footer Section */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <FiUser size={14} />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs">Click to Logout</p>
            </div>
            <FiLogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <span className="font-bold text-gray-800">Bosh Parfume</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FiMenu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {/* Header Content Dinamis */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {activeTab === "featured"
                  ? "Featured Showcase"
                  : `${activeTab} Management`}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage your {activeTab} data here.
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

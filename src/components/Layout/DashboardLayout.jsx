import React, { useState } from "react";
import { FiPackage, FiImage, FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout({ activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black text-white
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200
        `}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">BOSH ADMIN</h1>
          <p className="text-gray-400 text-sm">Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("products");
              setSidebarOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all
              ${
                activeTab === "products"
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }
            `}
          >
            <FiPackage size={20} />
            <span>Products</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("banners");
              setSidebarOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all
              ${
                activeTab === "banners"
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }
            `}
          >
            <FiImage size={20} />
            <span>Banners</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

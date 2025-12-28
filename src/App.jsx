import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/Layout/DashboardLayout";
import ProductManager from "./components/ProductManager";
import BannerManager from "./components/BannerManager";
import LoginPage from "./components/Auth";
import FeaturedProduct from "./components/ProductManager/FeaturedProduct";

// 1. IMPORT COMPONENT BARU
import DeveloperManager from "./components/DeveloperManager";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [activeTab, setActiveTab] = useState("products");

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      >
        {/* 2. LOGIC GANTI HALAMAN */}
        {activeTab === "products" && <ProductManager />}

        {activeTab === "featured" && <FeaturedProduct />}

        {activeTab === "banners" && <BannerManager />}

        {/* <--- TAMBAHAN: Developers Page */}
        {activeTab === "developers" && <DeveloperManager />}
      </DashboardLayout>
    </div>
  );
}

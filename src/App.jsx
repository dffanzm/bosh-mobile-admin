import React, { useState } from "react";
import DashboardLayout from "./components/Layout/DashboardLayout";
import ProductManager from "./components/ProductManager";
import BannerManager from "./components/BannerManager";

export default function App() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "products" ? <ProductManager /> : <BannerManager />}
      </DashboardLayout>
    </div>
  );
}

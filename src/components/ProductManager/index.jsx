import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase, API_BASE_URL } from "../../lib/supabase";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error load products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini?")) {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      loadProducts();
    }
  };

  const handleSubmit = async (formData, imageFile) => {
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const fileName = `products/${Date.now()}-${imageFile.name}`;
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, imageFile);
        if (error) throw error;

        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...formData, image_url: imageUrl };
      await axios.post(`${API_BASE_URL}/products`, payload);

      alert("✅ Product Saved!");
      loadProducts();
      return true;
    } catch (error) {
      console.error(error);
      alert("❌ Gagal save product");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProductForm onSubmit={handleSubmit} loading={loading} />
      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
}

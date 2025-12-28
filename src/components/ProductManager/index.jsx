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
      // Sort biar produk terbaru ada di atas
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setProducts(sorted);
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

  // Logic Tambah Produk
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

      // Payload lengkap dengan Notes
      const payload = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        image_url: imageUrl,
      };

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

  // Logic Edit Produk
  const handleEdit = async (id, formData, imageFile, oldImageUrl) => {
    setLoading(true);
    try {
      let imageUrl = oldImageUrl; // Default pake gambar lama

      // Kalau user upload gambar baru, ganti URL-nya
      if (imageFile) {
        const fileName = `products/${Date.now()}-${imageFile.name}`;
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, imageFile);
        if (error) throw error;
        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // Payload lengkap dengan Notes
      const payload = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        image_url: imageUrl,
      };

      await axios.put(`${API_BASE_URL}/products/${id}`, payload);
      alert("✅ Product Updated!");
      loadProducts();
      return true;
    } catch (error) {
      console.error(error);
      alert("❌ Gagal update product");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProductForm onSubmit={handleSubmit} loading={loading} />
      {/* Oper handleEdit ke ProductList */}
      <ProductList
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isUpdating={loading}
      />
    </div>
  );
}

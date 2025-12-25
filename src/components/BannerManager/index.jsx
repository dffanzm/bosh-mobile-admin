import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase, API_BASE_URL } from "../../lib/supabase";
import BannerUpload from "./BannerUpload";
import BannerList from "./BannerList";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error("Banner error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus banner ini?")) {
      await axios.delete(`${API_BASE_URL}/banners/${id}`);
      loadBanners();
    }
  };

  const handleSubmit = async (imageFile) => {
    if (!imageFile) {
      alert("Pilih gambar dulu bro!");
      return false;
    }

    setLoading(true);
    try {
      const fileName = `banners/${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);
      if (error) throw error;

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      await axios.post(`${API_BASE_URL}/banners`, {
        image_url: data.publicUrl,
      });

      alert("✅ Banner Uploaded!");
      loadBanners();
      return true;
    } catch (error) {
      console.error(error);
      alert("❌ Gagal upload banner");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <BannerUpload onSubmit={handleSubmit} loading={loading} />
      <BannerList banners={banners} onDelete={handleDelete} />
    </div>
  );
}

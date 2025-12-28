import React, { useState, useEffect } from "react";
import axios from "axios";
// Sesuaikan path API_BASE_URL lu
import { API_BASE_URL } from "../../lib/supabase";
import DeveloperForm from "./DeveloperForm";
import DeveloperList from "./DeveloperList";

export default function DeveloperManager() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/developers`);
      // Sort berdasarkan ID (terbaru bawah, atau ubah logic sort sesuai selera)
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setDevelopers(sorted);
    } catch (err) {
      console.error("Error load developers:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus member team ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/developers/${id}`);
        loadDevelopers();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus data");
      }
    }
  };

  // Logic Tambah Developer (Create)
  const handleSubmit = async (formData, imageFile) => {
    setLoading(true);
    try {
      // Kita pakai FormData karena backend butuh req.files
      const payload = new FormData();
      payload.append("nama", formData.nama);
      payload.append("jobdesk", formData.jobdesk);
      payload.append("ig_url", formData.ig_url);
      payload.append("github_url", formData.github_url);
      payload.append("linkedin_url", formData.linkedin_url);

      if (imageFile) {
        payload.append("foto", imageFile); // Key 'foto' sesuai backend
      }

      await axios.post(`${API_BASE_URL}/developers`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Team Member Added!");
      loadDevelopers();
      return true;
    } catch (error) {
      console.error(error);
      alert("❌ Gagal menambah member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logic Edit Developer (Update)
  const handleEdit = async (id, formData, imageFile) => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("nama", formData.nama);
      payload.append("jobdesk", formData.jobdesk);
      payload.append("ig_url", formData.ig_url);
      payload.append("github_url", formData.github_url);
      payload.append("linkedin_url", formData.linkedin_url);

      // Kirim foto lama sebagai string (biar backend tau kalo ga ada foto baru)
      payload.append("foto", formData.foto || "");

      if (imageFile) {
        payload.append("foto", imageFile); // Timpa dengan file baru
      }

      await axios.put(`${API_BASE_URL}/developers/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Team Member Updated!");
      loadDevelopers();
      return true;
    } catch (error) {
      console.error(error);
      alert("❌ Gagal update member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DeveloperForm onSubmit={handleSubmit} loading={loading} />
      <DeveloperList
        developers={developers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isUpdating={loading}
      />
    </div>
  );
}

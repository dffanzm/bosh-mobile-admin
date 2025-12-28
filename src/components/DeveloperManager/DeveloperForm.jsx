import React, { useState } from "react";
import {
  FiUpload,
  FiSave,
  FiGithub,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

export default function DeveloperForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    nama: "",
    jobdesk: "",
    ig_url: "",
    github_url: "",
    linkedin_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Wajib upload foto!");
      return;
    }
    const success = await onSubmit(form, imageFile);
    if (success) {
      setForm({
        nama: "",
        jobdesk: "",
        ig_url: "",
        github_url: "",
        linkedin_url: "",
      });
      setImageFile(null);
      setFileName("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Team Member</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAMA */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Ex: Daffa Najmudin"
            />
          </div>

          {/* JOBDESK */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Role / Jobdesk
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.jobdesk}
              onChange={(e) => setForm({ ...form, jobdesk: e.target.value })}
              placeholder="Ex: Backend Developer"
            />
          </div>

          {/* SOSMED LINKS */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiInstagram className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 p-2 border rounded-lg text-sm"
                value={form.ig_url}
                onChange={(e) => setForm({ ...form, ig_url: e.target.value })}
                placeholder="Instagram URL"
              />
            </div>
            <div className="relative">
              <FiGithub className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 p-2 border rounded-lg text-sm"
                value={form.github_url}
                onChange={(e) =>
                  setForm({ ...form, github_url: e.target.value })
                }
                placeholder="Github URL"
              />
            </div>
            <div className="relative">
              <FiLinkedin className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 p-2 border rounded-lg text-sm"
                value={form.linkedin_url}
                onChange={(e) =>
                  setForm({ ...form, linkedin_url: e.target.value })
                }
                placeholder="LinkedIn URL"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Profile Photo
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition border-gray-300">
              <input
                type="file"
                id="dev-image"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="dev-image" className="cursor-pointer block">
                <FiUpload className="mx-auto text-indigo-500 mb-2" size={24} />
                <p className="text-sm text-gray-600 font-medium">
                  {fileName || "Click to upload photo"}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50 transition font-medium ml-auto"
        >
          <FiSave /> {loading ? "Saving..." : "Save Member"}
        </button>
      </form>
    </div>
  );
}

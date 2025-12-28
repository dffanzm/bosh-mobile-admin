import React, { useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiX,
  FiUpload,
  FiSave,
  FiGithub,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

export default function DeveloperList({
  developers,
  onDelete,
  onEdit,
  isUpdating,
}) {
  const [editingDev, setEditingDev] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const openEditModal = (dev) => {
    setEditingDev(dev);
    setEditForm({
      nama: dev.nama,
      jobdesk: dev.jobdesk,
      ig_url: dev.ig_url || "",
      github_url: dev.github_url || "",
      linkedin_url: dev.linkedin_url || "",
      foto: dev.foto, // URL foto lama
    });
    setPreviewImage(dev.foto);
    setEditImageFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const success = await onEdit(editingDev.id, editForm, editImageFile);
    if (success) {
      setEditingDev(null);
    }
  };

  if (!developers || developers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">
          No team members yet. Add the first one!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* === GRID LIST === */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Team Members ({developers.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col"
            >
              {/* Image & Header */}
              <div className="p-6 flex flex-col items-center border-b border-gray-50 bg-gray-50/50">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-3">
                  <img
                    src={dev.foto}
                    alt={dev.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg text-center">
                  {dev.nama}
                </h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mt-1">
                  {dev.jobdesk}
                </span>
              </div>

              {/* Links & Actions */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div className="flex justify-center gap-4 mb-6">
                  {dev.ig_url && (
                    <a
                      href={dev.ig_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 hover:scale-110 transition"
                    >
                      <FiInstagram size={20} />
                    </a>
                  )}
                  {dev.github_url && (
                    <a
                      href={dev.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-800 hover:scale-110 transition"
                    >
                      <FiGithub size={20} />
                    </a>
                  )}
                  {dev.linkedin_url && (
                    <a
                      href={dev.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <FiLinkedin size={20} />
                    </a>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openEditModal(dev)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(dev.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MODAL EDIT === */}
      {editingDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">Edit Member</h3>
              <button
                onClick={() => setEditingDev(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editForm.jobdesk}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobdesk: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={editForm.ig_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ig_url: e.target.value })
                  }
                  placeholder="Instagram URL"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={editForm.github_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, github_url: e.target.value })
                  }
                  placeholder="Github URL"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={editForm.linkedin_url}
                  onChange={(e) =>
                    setEditForm({ ...editForm, linkedin_url: e.target.value })
                  }
                  placeholder="LinkedIn URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="edit-dev-image"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="edit-dev-image"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer transition"
                    >
                      <FiUpload size={16} /> Change Photo
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDev(null)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSave size={16} />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

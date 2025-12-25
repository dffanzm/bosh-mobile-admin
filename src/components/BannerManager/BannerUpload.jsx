import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

export default function BannerUpload({ onSubmit, loading }) {
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
    const success = await onSubmit(imageFile);
    if (success) {
      setImageFile(null);
      setFileName("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Upload Banner</h2>
      <p className="text-sm text-gray-600 mb-6">
        Recommended: Landscape image (1920×1080)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <input
            type="file"
            id="banner-image"
            onChange={handleFileChange}
            required
            className="hidden"
          />
          <label htmlFor="banner-image" className="cursor-pointer">
            <FiUpload className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="font-medium">
              {fileName || "Click to select banner image"}
            </p>
            {fileName && (
              <p className="text-sm text-gray-500 mt-1">{fileName}</p>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !imageFile}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          <FiUpload />
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>
    </div>
  );
}

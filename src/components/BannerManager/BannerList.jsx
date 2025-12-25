import React from "react";
import { FiTrash2, FiEye } from "react-icons/fi";

export default function BannerList({ banners, onDelete }) {
  if (banners.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <p className="text-gray-500">
          No banners yet. Upload your first banner!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Banner List ({banners.length})
      </h2>
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button
                onClick={() => window.open(banner.image_url, "_blank")}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <FiEye />
                Preview
              </button>
              <button
                onClick={() => onDelete(banner.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

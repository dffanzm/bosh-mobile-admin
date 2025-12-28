import React, { useState } from "react";
import {
  FiTrash2,
  FiStar,
  FiEdit2,
  FiX,
  FiUpload,
  FiSave,
} from "react-icons/fi";

export default function ProductList({
  products,
  onDelete,
  onEdit,
  isUpdating,
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // Buka Modal & Isi Data (Termasuk Notes)
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      rating: product.rating,
      tag: product.tag,
      description: product.description,
      // Handle null value biar gak warning di console
      top_note: product.top_note || "",
      middle_note: product.middle_note || "",
      base_note: product.base_note || "",
    });
    setPreviewImage(product.image_url);
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
    const success = await onEdit(
      editingProduct.id,
      editForm,
      editImageFile,
      editingProduct.image_url
    );
    if (success) {
      setEditingProduct(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">
          No products yet. Add your first product!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* === LIST PRODUCT === */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Product List ({products.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
            >
              <div className="aspect-video overflow-hidden bg-gray-100 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 text-xs font-bold bg-black/70 text-white px-2 py-1 rounded uppercase">
                  {product.tag}
                </span>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 truncate flex-1 pr-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-amber-500 text-sm font-medium">
                    <FiStar className="fill-current mr-1" size={14} />
                    {product.rating}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="font-bold text-emerald-600">
                    Rp {parseInt(product.price).toLocaleString("id-ID")}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      <FiTrash2 size={14} /> Del
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MODAL EDIT POPUP === */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rating: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.tag}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tag: e.target.value })
                    }
                  >
                    <option value="all">All Products</option>
                    <option value="new">New Arrivals</option>
                    <option value="best">Best Seller</option>
                  </select>
                </div>

                {/* --- FRAGRANCE NOTES (EDIT) --- */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="md:col-span-3 text-sm font-bold text-gray-700">
                    Fragrance Notes
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Top
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg text-sm"
                      value={editForm.top_note}
                      onChange={(e) =>
                        setEditForm({ ...editForm, top_note: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Middle
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg text-sm"
                      value={editForm.middle_note}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          middle_note: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Base
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg text-sm"
                      value={editForm.base_note}
                      onChange={(e) =>
                        setEditForm({ ...editForm, base_note: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Image & Desc */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="edit-image"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="edit-image"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer transition"
                      >
                        <FiUpload size={16} /> Change Image
                      </label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSave size={16} />{" "}
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from "react";
import { FiUpload, FiSave } from "react-icons/fi";

export default function ProductForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    tag: "all",
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
    const success = await onSubmit(form, imageFile);
    if (success) {
      setForm({ name: "", price: "", description: "", tag: "all" });
      setImageFile(null);
      setFileName("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (Rp)</label>
            <input
              type="number"
              required
              className="w-full p-2 border rounded-lg"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
            >
              <option value="all">All Products</option>
              <option value="new">New Arrivals</option>
              <option value="best">Best Seller</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Image
            </label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id="product-image"
                onChange={handleFileChange}
                required
                className="hidden"
              />
              <label htmlFor="product-image" className="cursor-pointer">
                <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600">
                  {fileName || "Click to upload image"}
                </p>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              required
              rows="3"
              className="w-full p-2 border rounded-lg"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter product description"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          <FiSave />
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}

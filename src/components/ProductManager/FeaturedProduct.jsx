import React, { useState, useEffect } from "react";
// Import Icon
import {
  X,
  Loader2,
  Smartphone,
  Edit2,
  UploadCloud,
  Image as ImageIcon,
  LayoutTemplate,
} from "lucide-react";

// Import Config Supabase & URL API dari lib
import { API_BASE_URL, supabase } from "../../lib/supabase";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE MODAL EDIT ---
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");

  // State Image 1: Main Product Image (Kotak/List)
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // State Image 2: Featured/Banner Image (Lebar/Hero)
  const [editFeatureImageFile, setEditFeatureImageFile] = useState(null);
  const [previewFeatureImage, setPreviewFeatureImage] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // --- 1. FETCH DATA (PRODUCTS & BANNERS) ---
  const fetchData = async () => {
    try {
      // Fetch Product & Banner barengan (Parallel)
      const [resProducts, resBanners] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/banners`),
      ]);

      if (!resProducts.ok || !resBanners.ok)
        throw new Error("Gagal mengambil data");

      const dataProducts = await resProducts.json();
      const dataBanners = await resBanners.json();

      // Sort produk berdasarkan is_featured
      const sortedData = dataProducts.sort(
        (a, b) => Number(b.is_featured) - Number(a.is_featured)
      );

      setProducts(sortedData);
      setBanners(dataBanners);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LOGIC TOGGLE FEATURED ---
  const toggleFeatured = async (product) => {
    const newStatus = !product.is_featured;
    const updated = products.map((p) =>
      p.id === product.id ? { ...p, is_featured: newStatus } : p
    );
    updated.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    setProducts(updated);

    try {
      await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: newStatus }),
      });
    } catch (err) {
      alert("Gagal update status!");
      fetchData(); // Revert fetch ulang
    }
  };

  // --- 3. LOGIC EDIT PRODUCT (Modal) ---
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditName(product.name);

    // Set Preview Awal
    setPreviewImage(product.image_url);
    // Kalau backend belum punya feature_image_url, fallback ke image_url biasa
    setPreviewFeatureImage(product.feature_image_url || product.image_url);

    // Reset Input File
    setEditImageFile(null);
    setEditFeatureImageFile(null);
  };

  // Handler Upload Main Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handler Upload Feature Image
  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFeatureImageFile(file);
      setPreviewFeatureImage(URL.createObjectURL(file));
    }
  };

  // --- CORE LOGIC: SAVE UPDATE (FIXED VERCEL LIMIT) ---
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsSaving(true);

    try {
      // 1. PREPARE VARIABLE URL GAMBAR (Default pakai URL lama)
      let finalImageUrl = editingProduct.image_url;
      let finalFeatureImageUrl = editingProduct.feature_image_url;

      // --- A. UPLOAD MAIN IMAGE KE SUPABASE (Jika ada file baru) ---
      if (editImageFile) {
        const fileExt = editImageFile.name.split(".").pop();
        const fileName = `icon-${Date.now()}.${fileExt}`;

        // Upload ke Bucket 'products'
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, editImageFile);

        if (uploadError) throw uploadError;

        // Ambil Public URL
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        finalImageUrl = data.publicUrl;
      }

      // --- B. UPLOAD FEATURE IMAGE KE SUPABASE (Jika ada file baru) ---
      if (editFeatureImageFile) {
        const fileExt = editFeatureImageFile.name.split(".").pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;

        // Upload ke Bucket 'products'
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, editFeatureImageFile);

        if (uploadError) throw uploadError;

        // Ambil Public URL
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        finalFeatureImageUrl = data.publicUrl;
      }

      // --- C. KIRIM JSON KE BACKEND (Bukan FormData) ---
      // Payload JSON ringan, dijamin lolos Vercel
      const payload = {
        name: editName,
        price: editingProduct.price,
        description: editingProduct.description || "",
        tag: editingProduct.tag,
        is_featured: editingProduct.is_featured,
        image_url: finalImageUrl, // URL String (Baru/Lama)
        feature_image_url: finalFeatureImageUrl, // URL String (Baru/Lama)
      };

      const res = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Header JSON
        },
        body: JSON.stringify(payload), // Body String JSON
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal update produk");
      }

      // Ambil hasil response
      const result = await res.json();

      // Karena backend mungkin return { message: "...", data: [...] } atau data object langsung
      // Kita ambil data update-nya dengan aman
      const updatedData = Array.isArray(result.data)
        ? result.data[0]
        : result.data || result;

      // --- D. UPDATE UI LOKAL ---
      const updatedList = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editName,
              image_url: finalImageUrl,
              feature_image_url: finalFeatureImageUrl,
            }
          : p
      );
      setProducts(updatedList);

      setEditingProduct(null); // Tutup modal
      alert("Produk berhasil diupdate!");
    } catch (err) {
      console.error("Error Saving:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const activeFeatured = products.filter((p) => p.is_featured);

  // CSS Hide Scrollbar
  const hideScrollStyle = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  if (loading)
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin inline" /> Loading...
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-fade-in font-sans relative">
      <style>{hideScrollStyle}</style>

      {/* --- MODAL EDIT (WIDER & DUAL IMAGE) --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  Edit Visuals
                </h3>
                <p className="text-xs text-gray-500">
                  Update images for App display
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Grid 2 Kolom untuk Gambar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* 1. Main Product Image (Kotak) */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <ImageIcon size={14} /> Product Detail
                  </span>
                  <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 relative group">
                    <img
                      src={previewImage}
                      alt="Main Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <UploadCloud size={14} /> Change
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Used in product grid & list views.
                  </p>
                </div>

                {/* 2. Feature / Banner Image (Lebar) */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-2">
                    <LayoutTemplate size={14} /> Product
                  </span>
                  <div className="w-full aspect-square bg-purple-50 rounded-xl overflow-hidden border-2 border-dashed border-purple-200 relative group">
                    {/* Preview Feature Image */}
                    <img
                      src={previewFeatureImage}
                      alt="Feature Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay Badge Simulation */}
                    <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-purple-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-2">
                        <UploadCloud size={14} /> Change Banner
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFeatureImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Used when product is featured or detailed.
                  </p>
                </div>
              </div>

              {/* Input Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="Enter product name"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3 mt-auto">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 1: DUAL MOCKUP PREVIEW --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-black rounded-lg text-white">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Mobile App Simulation
            </h3>
            <p className="text-xs text-gray-400">
              Live preview from your React Native code.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300">
          {/* HP 1: HOMEPAGE */}
          <div className="flex flex-col items-center">
            <span className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              1. Homepage View
            </span>
            <div className="w-[280px] h-[500px] bg-white border-8 border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-20"></div>

              <div className="h-full overflow-y-auto pt-10 px-0 pb-4 bg-[#F5F5F7] no-scrollbar">
                {/* --- HEADER (BANNER & TITLE) --- */}
                <div className="mb-4">
                  {/* BANNER SLIDER (Horizontal Scroll) */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-4 gap-3">
                    {banners.length > 0 ? (
                      banners.map((item) => (
                        <div
                          key={item.id}
                          className="snap-center shrink-0 w-[240px]"
                        >
                          <img
                            src={item.image_url}
                            alt="banner"
                            className="w-full h-[140px] rounded-2xl object-cover shadow-sm"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-[240px] h-[140px] bg-gray-300 rounded-2xl animate-pulse ml-4"></div>
                    )}
                  </div>

                  {/* DOT INDICATOR */}
                  <div className="flex justify-center gap-1 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-gray-800 text-sm px-5">
                    Featured Collection
                  </h4>
                </div>

                {/* --- GRID PRODUCT --- */}
                <div className="grid grid-cols-2 gap-3 px-4 pb-10">
                  {activeFeatured.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm h-48 relative group cursor-pointer"
                    >
                      {/* Full Cover Image (Updated to prioritize Feature Image if available) */}
                      <img
                        src={p.feature_image_url || p.image_url}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        alt=""
                      />
                      {/* Name Overlay */}
                      <div className="absolute bottom-0 w-full bg-white/90 py-2 px-2 text-center backdrop-blur-sm">
                        <p className="text-[9px] font-bold text-gray-800 uppercase truncate">
                          {p.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HP 2: PRODUCT LIST / DETAIL MOCKUP */}
          <div className="flex flex-col items-center">
            <span className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              2. Catalog View
            </span>
            <div className="w-[280px] h-[500px] bg-white border-8 border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-20"></div>

              <div className="h-full overflow-y-auto pt-10 px-4 pb-4 bg-white no-scrollbar">
                <div className="flex gap-2 mb-4">
                  <div className="h-8 w-full bg-gray-100 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-44 pb-2"
                    >
                      <div className="h-28 bg-gray-100 relative">
                        {/* List View always uses the main Icon (image_url) */}
                        <img
                          src={p.image_url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        {p.is_featured && (
                          <div className="absolute top-1 right-1 bg-black text-white text-[6px] px-1.5 py-0.5 rounded-sm">
                            HOT
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[9px] font-bold text-gray-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-[8px] font-semibold text-red-500 mt-0.5">
                          Rp {p.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: LIST MANAGEMENT --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-semibold text-gray-800">Product List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 uppercase text-[11px] font-bold text-gray-400 tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border border-gray-200">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="border border-gray-200 text-gray-500 px-2 py-1 rounded text-[10px] uppercase">
                      {product.tag}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* TOGGLE SWITCH */}
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        product.is_featured ? "bg-black" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.is_featured
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => handleEditClick(product)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 shadow-sm"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

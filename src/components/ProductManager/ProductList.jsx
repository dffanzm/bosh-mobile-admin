import React from "react";
import { FiTrash2 } from "react-icons/fi";

export default function ProductList({ products, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <p className="text-gray-500">
          No products yet. Add your first product!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Product List ({products.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.tag}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">
                  Rp {parseInt(product.price).toLocaleString()}
                </span>
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

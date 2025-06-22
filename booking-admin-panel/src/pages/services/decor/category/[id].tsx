//import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/axios";
import { DecorItem, DecorCategory } from "@/types/types";
import Link from "next/link";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";

export default function CategoryDetailPage() {
  const router = useRouter();
  const categoryId = Number(router.query.id);
  //const queryClient = useQueryClient();

  const [category, setCategory] = useState<DecorCategory | null>(null);
  const [items, setItems] = useState<DecorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingItem, setEditingItem] = useState<DecorItem | null>(null);

  const [newItem, setNewItem] = useState<Omit<DecorItem, "id" | "category">>({
    name: "",
    description: "",
    pricePerDay: 0,
    imageUrls: [],
    totalQuantity: 1,
    active: true,
  });

  useEffect(() => {
    if (!categoryId) return;
    api
      .get(`/api/decor-categories/${categoryId}`)
      .then((res) => setCategory(res.data as DecorCategory))
      .catch(() => setCategory(null));
  }, [categoryId]);

  const fetchItems = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/decor-items/by-category/${categoryId}`);
      setItems(res.data as DecorItem[]);
    } catch (err) {
      console.error("Failed to load decor items", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryId) return;
    fetchItems();
  }, [categoryId, showAddForm]);

  const handleCreateItem = async () => {
    if (!categoryId) return;
    try {
      if (editingItem) {
        await api.put(`/api/decor-items/${editingItem.id}`, {
          ...newItem,
          categoryId,
        });
      } else {
        await api.post("/api/decor-items", {
          ...newItem,
          categoryId,
        });
      }

      setNewItem({
        name: "",
        description: "",
        pricePerDay: 0,
        imageUrls: [],
        totalQuantity: 1,
        active: true,
      });
      setEditingItem(null);
      setShowAddForm(false);
      await fetchItems();
    } catch (err) {
      console.error("Create or update item failed", err);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/decor-items/${itemId}`);
        await fetchItems();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleToggleActive = async (itemId: number, currentActive: boolean) => {
    try {
      await api.patch(`/api/decor-items/${itemId}/toggle-active`, {
        active: !currentActive,
      });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, active: !currentActive } : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle item active", err);
    }
  };

  if (!category) return <p className="p-6">Loading category...</p>;

  return (
    <AdminLayout>
      <main className="p-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{category.name} Items</h1>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  setNewItem({
                    name: "",
                    description: "",
                    pricePerDay: 0,
                    imageUrls: [],
                    totalQuantity: 1,
                    active: true,
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                ➕ Add New
              </button>
              <Link
                href="/services/decor-categories"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                ← Back to Categories
              </Link>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white p-4 rounded-xl mb-6 space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Price per day"
                value={newItem.pricePerDay}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    pricePerDay: parseFloat(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Total quantity"
                value={newItem.totalQuantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    totalQuantity: parseInt(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files) return;
                  const urls: string[] = [];
                  for (const file of Array.from(files)) {
                    const url = await uploadToCloudinary(file);
                    urls.push(url);
                  }
                  setNewItem((prev) => ({
                    ...prev,
                    imageUrls: [...prev.imageUrls, ...urls],
                  }));
                }}
              />
              <button
                onClick={() => setShowImagePicker(true)}
                className="bg-gray-200 text-sm px-3 py-1 rounded"
              >
                📷 Choose from Cloudinary
              </button>

              {showImagePicker && (
                <CloudinaryImagePicker
                  onSelect={(url) => {
                    setNewItem((prev) => ({
                      ...prev,
                      imageUrls: [...prev.imageUrls, url],
                    }));
                    setShowImagePicker(false);
                  }}
                  onClose={() => setShowImagePicker(false)}
                />
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleCreateItem}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {editingItem ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading decor items...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500 italic">
              No decor items in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow space-y-2 flex flex-col justify-between"
                >
                  {item.imageUrls?.[0] && (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-sm">
                      💲 {item.pricePerDay.toFixed(2)} / day
                    </p>
                    <p className="text-sm text-gray-600">
                      Available: {item.totalQuantity}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={
                          item.active
                            ? "text-green-600 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddForm(true);
                        setNewItem({
                          name: item.name,
                          description: item.description,
                          pricePerDay: item.pricePerDay,
                          imageUrls: item.imageUrls || [],
                          totalQuantity: item.totalQuantity,
                          active: item.active,
                        });
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleToggleActive(item.id, item.active)}
                      className={`mt-2 px-4 py-2 rounded text-sm font-medium transition ${
                        item.active
                          ? "bg-red-50 text-dark-700 hover:bg-red-200"
                          : "bg-green-50 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {item.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

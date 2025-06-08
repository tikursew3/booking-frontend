import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import {
  useAllDecorItems,
  useAddDecorItem,
  useUpdateDecorItem,
  useDeleteDecorItem,
} from "@/hooks/useDecorItems";
import { useDecorCategories } from "@/hooks/useDecorCategories";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { DecorItem } from "@/types/types";
import { useState } from "react";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";
import api from "@/lib/axios";

export default function DecorAdminPage() {
  const { data: decorItems, isLoading, error } = useAllDecorItems();
  console.log("Decor items:", decorItems);

  const { data: categories } = useDecorCategories();
  const addMutation = useAddDecorItem();
  const updateMutation = useUpdateDecorItem();
  const deleteMutation = useDeleteDecorItem();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingItem, setEditingItem] = useState<DecorItem | null>(null);

  const [formData, setFormData] = useState<Omit<DecorItem, "id">>({
    name: "",
    description: "",
    imageUrls: [],
    pricePerDay: 0,
    totalQuantity: 1,
    active: true,
    category: {
      id: 0,
      name: "",
      description: "",
      imageUrl: "",
      active: true,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "pricePerDay" || name === "totalQuantity"
        ? parseFloat(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrls: [],
      pricePerDay: 0,
      totalQuantity: 1,
      active: true,
      category: {
        id: 0,
        name: "",
        description: "",
        imageUrl: "",
        active: true,
      },
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({
        ...editingItem,
        ...formData,
        category: formData.category,
      });
    } else {
      addMutation.mutate({
        name: formData.name,
        description: formData.description,
        imageUrls: formData.imageUrls,
        pricePerDay: formData.pricePerDay,
        totalQuantity: formData.totalQuantity,
        active: formData.active,
        categoryId: formData.category.id,
      });
    }
    resetForm();
  };

  const handleEdit = (item: DecorItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      imageUrls: item.imageUrls ?? [],
      pricePerDay: item.pricePerDay,
      totalQuantity: item.totalQuantity,
      active: item.active,
      category: item.category,
    });
    setShowForm(true);
  };
   
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = async (item: DecorItem) => {
    try {
      await api.patch(`/api/decor-items/${item.id}/toggle-active`, {
        active: !item.active,
      });
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <AdminLayout>
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎀 Manage Decor Items</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
          >
            ➕ Add New
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4 mb-10"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <select
              value={formData.category.id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: {
                    ...prev.category,
                    id: Number(e.target.value),
                  },
                }))
              }
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">-- Select Category --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleInputChange}
              placeholder="Price per day"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <input
              type="number"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleInputChange}
              placeholder="Total quantity"
              className="w-full border px-4 py-2 rounded"
              required
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border px-4 py-2 rounded cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              📷 Choose from Cloudinary
            </button>

            {formData.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.imageUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${i}`}
                      className="w-24 h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          imageUrls: prev.imageUrls.filter((_, j) => j !== i),
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
              />
              Active
            </label>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                {editingItem ? "Update Item" : "Add Item"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>

            {showImagePicker && (
              <CloudinaryImagePicker
                onSelect={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    imageUrls: [...prev.imageUrls, url],
                  }));
                  setShowImagePicker(false);
                }}
                onClose={() => setShowImagePicker(false)}
              />
            )}
          </form>
        )}

        {isLoading && <p className="text-gray-500">Loading items...</p>}
        {error && <p className="text-red-500">Failed to load items.</p>}

        {Array.isArray(decorItems) && decorItems.length === 0 && (
          <p>No active decor items found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {decorItems?.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-xl p-4 space-y-2">
              {item.imageUrls?.[0] && (
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">
                💲 {item.pricePerDay.toFixed(2)} / day
              </p>
              <p className="text-sm">🧱 Qty: {item.totalQuantity}</p>
              <p className="text-sm text-gray-500 italic">
                📂 {item.category?.name}
              </p>

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => handleToggle(item)}
                  className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  {item.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AdminLayout>
  );
}

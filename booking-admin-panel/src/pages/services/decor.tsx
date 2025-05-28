// src/pages/admin/services/decor.tsx

import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/axios";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";

import {
  useAllDecorItems,
  useAddDecorItem,
  useUpdateDecorItem,
  useDeleteDecorItem,
} from "@/hooks/useDecorItems";
import { DecorItem } from "@/types/types";
import { useState } from "react";

export default function DecorAdminPage() {
  const { data: decorItems, isLoading, error } = useAllDecorItems();
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
    active: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "pricePerDay"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updateMutation.mutate({ ...editingItem, ...formData });
    } else {
      addMutation.mutate(formData);
    }

    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      imageUrls: [],
      pricePerDay: 0,
      active: true,
    });
    setShowForm(false);
  };

  const handleEdit = (item: DecorItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      imageUrls: item.imageUrls ?? [],
      pricePerDay: item.pricePerDay,
      active: item.active,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this decor item?")) {
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
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">🎀 Manage Decor Items</h1>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  name: "",
                  description: "",
                  imageUrls: [],
                  pricePerDay: 0,
                  active: true,
                });
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
            >
              ➕ Add New Decor Item
            </button>
          </div>

          {showForm && (
            <>
              <form
                onSubmit={handleSubmit}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-10 space-y-4 max-w-xl w-full mx-auto overflow-y-auto max-h-[90vh]"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />

                <div className="space-y-2">
                  <label className="block font-medium">Images</label>

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
                    className="bg-gray-200 px-4 py-2 rounded text-sm"
                  >
                    📷 Choose from Cloudinary
                  </button>

                  {formData.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Image ${index}`}
                            className="w-24 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrls: prev.imageUrls.filter(
                                  (_, i) => i !== index
                                ),
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
                </div>

                <input
                  type="number"
                  name="pricePerDay"
                  placeholder="Price per day"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  Active
                </label>

                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl"
                  >
                    {editingItem ? "Update Item" : "Add Item"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>

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
            </>
          )}

          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Failed to load decor items.</p>}

          {decorItems && decorItems.length > 0 && (
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full bg-white table-auto shadow-md rounded-xl overflow-hidden">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-4">Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {decorItems
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((item) => (
                      <tr key={item.id} className="border-t odd:bg-white even:bg-gray-200">
                        <td className="p-4">
                          {item.imageUrls?.[0] && (
                            <img
                              src={item.imageUrls[0]}
                              alt={item.name}
                              className="w-20 h-14 object-cover rounded"
                            />
                          )}
                        </td>
                        <td>{item.name}</td>
                        <td className="max-w-xs truncate">{item.description}</td>
                        <td>${item.pricePerDay.toFixed(2)}</td>
                        <td>
                          <button
                            onClick={() => handleToggle(item)}
                            className={`px-3 py-1 rounded ${
                              item.active ? "bg-green-600" : "bg-gray-400"
                            } text-white`}
                          >
                            {item.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="text-right space-x-2 pr-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white pb-1 px-3 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white pb-1 px-3 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

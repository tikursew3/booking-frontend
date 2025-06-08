import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/axios";
import { DecorCategory } from "@/types/types";

import { useDecorCategories } from "@/hooks/useDecorCategories";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";

export default function AdminDecorCategoriesPage() {
  const { data: categories, error, isLoading } = useDecorCategories();

  const [localCategories, setLocalCategories] = useState<DecorCategory[]>([]);

  console.log("Categories:", categories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DecorCategory | null>(null);
  const [formData, setFormData] = useState<Omit<DecorCategory, "id">>({
    name: "",
    description: "",
    imageUrl: "",
    active: true,
  });
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const fetchCategoriesManually = async () => {
    // Optional: only if you want to revalidate SWR manually
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (editing) {
      const res = await api.put<DecorCategory>(`/api/decor-categories/${editing.id}`, formData);
      setLocalCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? res.data : c))
      );
    } else {
      const res = await api.post<DecorCategory>("/api/decor-categories", formData);
      setLocalCategories((prev) => [...prev, res.data]); // ✅ add to list
    }

    setFormData({ name: "", description: "", imageUrl: "", active: true });
    setEditing(null);
    setShowForm(false);
  } catch (err) {
    console.error("Failed to submit category", err);
  }
};


  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await api.delete(`/api/decor-categories/${id}`);
      fetchCategoriesManually();
    }
  };

  useEffect(() => {
  if (categories) {
    setLocalCategories(categories);
  }
}, [categories]);

  const handleToggle = async (category: DecorCategory) => {
  try {
    await api.put(`/api/decor-categories/${category.id}`, {
      ...category,
      active: !category.active,
    });

    // update local list directly
    setLocalCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, active: !category.active } : c
      )
    );
  } catch (err) {
    console.error("Failed to toggle category", err);
  }
};



  return (
    <AdminLayout>
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎀 Decor Categories</h1>
          <button
            onClick={() => {
              setFormData({ name: "", description: "", imageUrl: "", active: true });
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >    
            ➕ Add Category
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4 mb-10 max-w-xl mx-auto"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Category Name"
              required
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
              className="w-full border px-4 py-2 rounded"
            />
            <div>
              <label className="font-semibold mb-1 block">Image</label>

                {/* 📁 Local file upload */}
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadToCloudinary(file); // upload helper
                  setFormData((prev) => ({ ...prev, imageUrl: url }));
                }
              }}
              className="mb-2"
            />

              <button
                type="button"
                onClick={() => setShowImagePicker(true)}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                📷 Choose from Cloudinary
              </button>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 w-32 h-20 object-cover rounded border"
                />
              )}
            </div>

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
                {editing ? "Update Category" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>

            {showImagePicker && (
              <CloudinaryImagePicker
                onSelect={(url) => {
                  setFormData((prev) => ({ ...prev, imageUrl: url }));
                  setShowImagePicker(false);
                }}
                onClose={() => setShowImagePicker(false)}
              />
            )}
          </form>
        )}

        {isLoading && <p className="text-gray-500">Loading categories...</p>}
        {error && <p className="text-red-500">Failed to load categories</p>}

        {Array.isArray(categories) && categories.length === 0 && (
          <p>No categories found</p>
        )}     

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories) &&
            localCategories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                <Link href={`/services/decor/category/${cat.id}`}>
                  <img
                    src={cat.imageUrl || "/placeholder.jpg"}
                    alt={cat.name}
                    className="w-full h-40 object-cover rounded cursor-pointer"
                  />
                </Link>
                <h2 className="text-xl font-semibold">{cat.name}</h2>
                <p className="text-gray-600">{cat.description}</p>
                <p className={cat.active ? "text-green-600" : "text-red-500"}>
                  {cat.active ? "✅ Active" : "🚫 Inactive"}
                </p>

                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => {
                      setEditing(cat);
                      setFormData({
                        name: cat.name,
                        description: cat.description || "",
                        imageUrl: cat.imageUrl || "",
                        active: cat.active,
                      });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggle(cat)}
                    className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    {cat.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </AdminLayout>
  );
}

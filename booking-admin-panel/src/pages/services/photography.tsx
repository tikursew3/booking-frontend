import AdminLayout from "@/components/AdminLayout";
import api from "@/lib/axios";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";

import { useServices } from "@/hooks/useServices";
import { PhotographyService } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function PhotographyServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingService, setEditingService] =
    useState<PhotographyService | null>(null);

  const [formData, setFormData] = useState<Omit<PhotographyService, "id">>({
    name: "",
    description: "",
    imageUrls: [],
    price: 0,
    depositAmount: 0,
    duration: "",
    active: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "price" || name === "depositAmount"
        ? parseFloat(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
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

    try {
      if (editingService) {
        await api.put(`/api/photography-services/${editingService.id}`, formData);
      } else {
        await api.post("/api/photography-services", formData);
      }

      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        imageUrls: [],
        price: 0,
        depositAmount: 0,
        duration: "",
        active: true,
      });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["photography-services"] });
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleEdit = (service: PhotographyService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      imageUrls: service.imageUrls || [],
      price: service.price,
      depositAmount: service.depositAmount,
      duration: service.duration,
      active: service.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/api/photography-services/${id}`);
        queryClient.invalidateQueries({ queryKey: ["photography-services"] });
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleToggle = async (service: PhotographyService) => {
    try {
      await api.patch(`/api/photography-services/${service.id}/toggle-active`, {
        active: !service.active,
      });
      queryClient.invalidateQueries({ queryKey: ["photography-services"] });
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">📸 Photography Services</h1>
            <button
              onClick={() => {
                setEditingService(null);
                setFormData({
                  name: "",
                  description: "",
                  imageUrls: [],
                  price: 0,
                  depositAmount: 0,
                  duration: "",
                  active: true,
                });
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
            >
              ➕ Add New
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
                            alt={`Selected ${index}`}
                            className="w-24 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrls: prev.imageUrls.filter((_, i) => i !== index),
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
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="depositAmount"
                  placeholder="Deposit Amount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g. 1 hour)"
                  value={formData.duration}
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
                    {editingService ? "Update Service" : "Add Service"}
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
          {error && <p className="text-red-500">Failed to load services</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              ?.slice()
              .sort((a, b) => a.id - b.id)
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-white border rounded-xl shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    {service.imageUrls?.length > 0 && (
                      <img
                        src={service.imageUrls[0]}
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {service.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      💲${service.price.toFixed(2)} | 💰 Deposit: $
                      {service.depositAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">⏱ {service.duration}</p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        service.active ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {service.active ? "✅ Active" : "🚫 Disabled"}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between mt-4 gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggle(service)}
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      {service.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

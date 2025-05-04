import { useEffect, useState } from "react";
import { DecorItem } from "@/types/types";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

interface Props {
  initialData?: DecorItem;
  onSubmit: (data: Omit<DecorItem, "id">) => void;
  onCancel?: () => void;
}

export default function DecorItemForm({ initialData, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<Omit<DecorItem, "id">>({
    name: "",
    description: "",
    imageUrls: [],
    pricePerDay: 0,
    active: true,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        imageUrls: initialData.imageUrls || [],
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "pricePerDay"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploaded],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full relative">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-xl shadow-md"
        >
          <input
            type="text"
            name="name"
            placeholder="Decor Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-4 py-2"
          />

          {/* 📁 Upload from local files */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLocalImageUpload}
            className="w-full border rounded px-4 py-2 cursor-pointer"
          />

          {/* ☁️ Choose from Cloudinary */}
          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            className="bg-gray-200 px-4 py-2 rounded text-sm"
          >
            📷 Choose from Cloudinary
          </button>

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

          {/* 📸 Preview selected images */}
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Image ${index}`}
                    className="w-24 h-16 object-cover border rounded"
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

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per day"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            step="0.01"
            min="0"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Active (Visible on website)</span>
          </label>

          <div className="flex justify-end gap-4 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {initialData ? "Update" : "Add"} Decor Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

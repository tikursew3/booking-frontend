import { PhotographyService } from "@/types/types";
import { useState, useEffect } from "react";
import CloudinaryImagePicker from "@/components/CloudinaryImagePicker";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

type Props = {
  initialData?: PhotographyService | null;
  onSubmit: (data: Omit<PhotographyService, "id">) => void;
  onClose: () => void;
};

export default function ServiceForm({ initialData, onSubmit, onClose }: Props) {
  const [formData, setFormData] = useState<Omit<PhotographyService, "id">>({
    name: "",
    description: "",
    imageUrls: [],
    price: 0,
    depositAmount: 0,
    duration: "1 hour",
    active: true,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "depositAmount" ? parseFloat(value) : value,
    }));
  };

  const handleLocalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full relative">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Service" : "Add New Service"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Service Name"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-4 py-2 rounded"
            rows={3}
            required
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLocalImageChange}
            className="w-full border px-4 py-2 rounded cursor-pointer"
          />

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

          {formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Image ${index}`} className="w-24 h-16 object-cover border rounded" />
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
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            placeholder="Deposit Amount"
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (e.g. 1 hour)"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

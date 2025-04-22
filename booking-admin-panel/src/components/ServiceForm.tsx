// src/components/ServiceForm.tsx
import { PhotographyService } from "@/types/types";
import { useState, useEffect } from "react";

type Props = {
  initialData?: PhotographyService | null;
  onSubmit: (data: Omit<PhotographyService, "id">) => void;
  onClose: () => void;
};

export default function ServiceForm({ initialData, onSubmit, onClose }: Props) {
  const [formData, setFormData] = useState<Omit<PhotographyService, "id">>({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    depositAmount: 0,
    duration: "1 hour",
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      const { ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "depositAmount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl w-full relative">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Service" : "Add New Service"}
        </h2>

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
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border px-4 py-2 rounded"
            required
          />
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
            placeholder="Duration (e.g., 1 hour)"
            className="w-full border px-4 py-2 rounded"
            required
          />

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

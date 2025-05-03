import { useEffect, useState } from "react";
import api from "@/lib/axios";

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export default function CloudinaryImagePicker({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get<string[]>("/api/cloudinary/images");
        setImages(res.data);
      } catch (err) {
        console.error("Failed to load Cloudinary images", err);
        alert("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-xl font-bold hover:text-black"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          📷 Choose an Image from Cloudinary
        </h2>

        {loading ? (
          <p className="text-center">Loading images...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url) => (
              <div
                key={url}
                className="cursor-pointer hover:opacity-80 transition"
                onClick={() => onSelect(url)}
              >
                <img
                  src={url}
                  alt="Cloudinary"
                  className="w-full h-40 object-cover rounded border"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

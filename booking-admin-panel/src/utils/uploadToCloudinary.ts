import axios from "axios";

type CloudinaryUploadResponse = {
    secure_url: string;
    public_id: string;
    // You can add more fields if needed
  };

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_decor_upload"); // my Cloudinary preset name

  const response = await axios.post<CloudinaryUploadResponse>(
    "https://api.cloudinary.com/v1_1/dyz6pt46f/image/upload", // my cloud name -> dyz6pt46f
    formData
  );

  return response.data.secure_url;
};

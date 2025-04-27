import api from "@/lib/axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/admin-logout"); // Backend clears cookie
      toast.success("You have been logged out!");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1000);
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
    >
      Logout
    </button>
  );
}
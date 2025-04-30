import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { adminLogout } from "@/pages/api/adminAuth";
import { Home, Camera, Gift, Calendar, BookOpen, LogOut } from "lucide-react"; // Example icons

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/index", icon: <Home size={20} /> },
    { name: "Photography", href: "/services/photography", icon: <Camera size={20} /> },
    { name: "Decor", href: "/services/decor", icon: <Gift size={20} /> },
    { name: "Calendar", href: "/calendar", icon: <Calendar size={20} /> },
    { name: "Bookings", href: "/bookings", icon: <BookOpen size={20} /> },
  ];

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-white text-black overflow-x-auto">
      {/* Responsive Sidebar: shrinks on mobile */}
      <aside className="w-20 md:w-64 bg-gray-900 text-white flex-shrink-0 min-h-screen">
        <div className="px-4 py-6 text-center border-b border-gray-700">
          <h2 className="text-sm md:text-xl font-bold">Admin</h2>
        </div>

        <nav className="flex flex-col justify-between h-full">
          <ul className="space-y-2 px-2 pt-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
                    router.pathname === item.href ? "bg-gray-800 font-semibold" : ""
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-2 mt-6 mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-left rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 bg-gray-100 overflow-x-auto">{children}</main>
    </div>
  );
}

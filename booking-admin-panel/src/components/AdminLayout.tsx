import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { adminLogout } from "@/pages/api/adminAuth";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();

  const navItems = [
    { name: "🏠 Dashboard", href: "/index" },
    { name: "📸 Photography Services", href: "/services/photography" },
    { name: "🎀 Decor Items", href: "/services/decor" },
    { name: "📅 Calendar", href: "/calendar" },
    { name: "📖 Bookings", href: "/bookings" },
  ];

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-row bg-white text-black">
      {/* Sidebar always on the left */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0">
        <div className="px-4 py-6 text-center border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="flex flex-col justify-between h-full">
          <ul className="space-y-2 px-4 pt-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                    router.pathname === item.href
                      ? "bg-gray-800 font-semibold"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 mt-6 mb-4">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              🚪 Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-4 overflow-x-auto">{children}</main>
    </div>
  );
}

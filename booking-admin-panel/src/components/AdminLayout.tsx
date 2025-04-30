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
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">
      {/* Sticky top nav on mobile, vertical sidebar on desktop */}
      <aside className="w-full md:w-64 bg-gray-900 text-white sticky top-0 z-50 md:relative md:top-auto">
        <div className="px-4 py-4 md:py-6 md:text-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav>
          <ul className="space-y-2 px-4 pb-4">
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

          {/* Logout button */}
          <div className="px-4 mt-4 pb-4">
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
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}

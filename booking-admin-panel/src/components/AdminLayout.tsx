import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { adminLogout } from "@/pages/api/adminAuth"; 

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* Mobile header bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 bg-gray-900 text-white">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setMobileOpen((prev) => !prev)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-900 text-white md:min-h-screen`}
      >
        <div className="px-4 pt-4 pb-2 md:pt-6 md:text-center text-left">
          <h2 className="text-xl font-bold hidden md:block">Admin Panel</h2>
        </div>

        <nav>
          <ul className="space-y-2 px-4 pb-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                    router.pathname === item.href ? "bg-gray-800 font-semibold" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
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

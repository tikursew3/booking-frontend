import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

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

  return (
    <div className="bg-white text-black min-h-screen p-8">
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white md:min-h-screen">
        <div className="flex items-center justify-between px-4 py-4 md:justify-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className={`${mobileOpen ? "block" : "hidden"} md:block`}>
          <ul className="space-y-2 px-4 pb-4 md:pb-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                    router.pathname === item.href
                      ? "bg-gray-800 font-semibold"
                      : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-4">{children}</main>
    </div>
    </div>
  );
}

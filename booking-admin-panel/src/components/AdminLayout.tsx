import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { adminLogout } from "@/pages/api/adminAuth";
import { Home, Camera, Gift, Calendar, BookOpen, LogOut } from "lucide-react";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/index", icon: <Home size={20} /> },
    {
      name: "Photography",
      href: "/services/photography",
      icon: <Camera size={20} />,
    },
    { name: "Decor", href: "/services/decor", icon: <Gift size={20} /> },
    { name: "Calendar", href: "/calendar", icon: <Calendar size={20} /> },
    { name: "Bookings", href: "/bookings", icon: <BookOpen size={20} /> },
  ];

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-white text-black dark:bg-gray-900 dark:text-white overflow-x-auto">
      {/* Sidebar (permanently dark) */}
      <aside className="fixed top-0 left-0 w-20 md:w-64 h-screen z-40 flex-shrink-0 bg-[#111827] text-white">
        <div className="px-4 py-6 text-center border-b border-[#1F2937]">
          <h2 className="text-sm md:text-xl font-bold text-white">Admin</h2>
        </div>

        <nav className="flex flex-col justify-between h-full">
          <ul className="space-y-2 px-2 pt-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition text-white hover:bg-[#1F2937] ${
                    router.pathname === item.href
                      ? "bg-[#1F2937] font-semibold"
                      : ""
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              </li>
            ))}
            <div className="px-2 mt-6 mb-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-left rounded bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold transition"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full flex-1 bg-gray-100 ml-20 md:ml-64 overflow-x-hidden">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function QuickLinks() {
  return (
    <section className="py-16 px-6 bg-gray-100 text-center border-t border-gray-300">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🔗 Quick Links</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Quickly navigate to key sections of our website.
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-lg font-medium">
        <Link href="/photography" className="text-purple-700 hover:underline">
          📸 Photography
        </Link>
        <Link href="/decor" className="text-pink-600 hover:underline">
          🎀 Decor
        </Link>
        <Link href="/booking" className="text-blue-600 hover:underline">
          🗓️ Book Now
        </Link>
        <Link href="/contact" className="text-green-600 hover:underline">
          📬 Contact Us
        </Link>
        <Link href="/about" className="text-gray-700 hover:underline">
          📖 About Us
        </Link>
      </div>
    </section>
  );
}

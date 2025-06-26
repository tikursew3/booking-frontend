import Link from "next/link";


export default function QuickLinks() {
  {/* Quick Links */}
  return (
    
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            🔗 Quick Links
          </h3>
          <ul className="space-y-2 text-lg">
            <li>
              <Link
                href="/photography"
                className="hover:underline text-purple-400"
              >
                Photography
              </Link>
            </li>
            <li>
              <Link href="/decor" className="hover:underline text-pink-400">
                Decor
              </Link>
            </li>
            <li>
              <Link href="/booking" className="hover:underline text-blue-400">
                Book Now
              </Link>
            </li>
            <li>
              <Link href="/contact-us/contact" className="hover:underline text-green-400">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline text-gray-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>
  );
}

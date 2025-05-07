import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* A Glimpse of Our Services */}
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            📸 A Glimpse Of Our Services
          </h3>
          <ul className="space-y-2 text-lg">
            <li>• Studio & Field Photography</li>
            <li>• Weddings & Proposals</li>
            <li>• Baby Showers & Birthdays</li>
            <li>• Decor Rentals & Setup</li>
          </ul>
        </div>

        {/* Quick Links */}
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

        {/* Get In Touch */}
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            📬 Get In Touch
          </h3>
          <p className="text-lg">
            Email:{" "}
            <a
              href="mailto:info@yourbusiness.com"
              className="text-blue-400 hover:underline"
            >
              info@mybusiness.com
            </a>
          </p>
          <p className="text-lg">
            Phone:{" "}
            <a href="tel:+1234567890" className="text-blue-400 hover:underline">
              +1 (234) 567-890
            </a>
          </p>
          <p className="text-lg mt-2">
            Follow us on:
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-30 h-15 text-white hover:text-blue-900 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-30 h-15 text-white hover:text-blue-900 transition" />
              </a>
          </p>
        </div>

        {/* Operational Hours + Location */}
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            ⏰ Hours & Location
          </h3>
          <p className="text-lg">Mon - Fri: 9:00 AM - 6:00 PM</p>
          <p className="text-lg">Sat: 10:00 AM - 4:00 PM</p>
          <p className="text-lg mb-4">Sun: Closed</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=PASTE_THE_GOOGLE_MAP_EMBED_LINK_HERE"
            width="100%"
            height="120"
            className="rounded border-none"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="text-center text-lg text-white mt-10">
        © {new Date().getFullYear()} Business Name. All rights reserved.
      </div>
    </footer>
  );
}

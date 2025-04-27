import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Optional: use heroicons/lucide
import { usePathname } from 'next/navigation';

export default function AlternateHeader() {
  const [isOpen, setIsOpen] = useState(false);
   const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Service', href: '/services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '/contact-us/contact' },
  ];

  return (
    <header className="absolute top-0 w-full z-50 bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">Eden Photo and Decor</div>

        {/* Desktop Nav */}
       

        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                pathname === link.href ? 'text-[#A9F79F] font-bold' : 'text-[#F9F79F]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>



        {/* Mobile menu toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6"  /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-purple-700 to-pink-600 px-4 py-4 shadow rounded-b-xl">
          <ul className="flex flex-col space-y-4 text-[#333333]  font-bold text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`transition ${
                    pathname === link.href ? 'text-[#070808] hover:text-[#f5498b]' : 'text-[#98f5f5] hover:text-[#f5498b]'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
       
    </header>
  );
}  

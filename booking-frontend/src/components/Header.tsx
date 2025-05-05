import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Service', href: '/services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '/contact-us/contact' },
  ];
 
  return (
    
    
<header className="w-full z-50 bg-[#a18132]/70 backdrop-blur-md shadow-md rounded-b-2xl">
{/* <header className="fixed top-0 left-0 w-full z-50 h-16 bg-white/30 backdrop-blur-md supports-[backdrop-filter]:bg-white/20 shadow-md"> */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-[#4f4e4a] tracking-tight">
          Eden Photo and Decor
        </div>
        <nav className="hidden md:flex space-x-8 text-[#F9F79F] font-medium text-lg">
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
        <div className="md:hidden">
          {!isOpen ? (
            <Menu
              className="w-8 h-8 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          ) : (
            <X
              className="w-8 h-8 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="px-4 py-4">
          <ul className="flex flex-col space-y-4 font-bold text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`transition ${
                    pathname === link.href ? 'text-[#070f21] hover:text-[#f5498b]' : 'text-[#070f21] hover:text-[#f5498b]'
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

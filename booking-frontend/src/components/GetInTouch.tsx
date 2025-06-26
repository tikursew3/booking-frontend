import { Facebook, Instagram } from "lucide-react";

export default function GetInTouch() {
    {/* Get In Touch */}
  return (
    
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            📬 Get In Touch
          </h3>
          <p className="text-lg">
            Email:{" "}
            <a
              href="mailto:Edensparty26@gmail.com"
              className="text-blue-400 hover:underline"
            >
              Edensparty26@gmail.com
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
  );

}
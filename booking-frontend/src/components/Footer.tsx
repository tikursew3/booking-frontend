

import GetInTouch from "./GetInTouch";
import GlimpseOfOurServices from "./GlimpseOfOurServices";
import OperationalHours from "./OperationalHours";
import QuickLinks from "./QuickLinks";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <GlimpseOfOurServices />
        <QuickLinks />
        <GetInTouch />
        <OperationalHours />
        
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-2">
          © {new Date().getFullYear()} Eden Photography and Decor. All rights reserved.
        </p>
        <p>
          Website by{" "}
          <span className="font-semibold text-pink-300">Menelik Tawye</span> —{" "}
          <a
            href="tel:+16513549679"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            +1 (651) 354-9679
          </a>
        </p>
      </div>
    </footer>
  );
}

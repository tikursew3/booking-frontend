import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[100vh] pt-16 w-full overflow-hidden">
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/common-element.jpg"
          alt="Photography and Decor Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/10 z-10"></div>

      {/* Main content */}

      <div className="relative z-20 flex flex-col items-center justify-center text-center h-full px-4 pt-28">
        <h1 className="text-4xl  md:text-5xl font-bold mb-4 text-white">
          We Capture. We Create.
        </h1>
        <p className="text-5xl text-gray-200 mb-10">
          Timeless moments & stunning decor for every occasion.
        </p>
      </div>

      {/* Scrollable Buttons */}
      <div className="absolute top-15 left-0 right-0 flex justify-between px-8 z-30">
        <Link
          href="/photography"
          className="bg-[#232b6e] hover:bg-blue-700 text-white py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105"
        >
          Photography
        </Link>

        <Link
          href="/decor"
          className="bg-[#99b50e] hover:bg-yellow-600 text-white py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105"
        >
          Decor
        </Link>
      </div>
    </section>
  );
}

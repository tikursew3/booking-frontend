import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/common-element.jpg"
          alt="Photography and Decor Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/10 z-10"></div>

      
      

      {/* Text content */}
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center h-full px-4">
      
        <h1 className="text-4xl  md:text-5xl font-bold mb-4 text-white">
          We Capture. We Create.
        </h1>
        <p className="text-5xl text-gray-200 mb-10">
          Timeless moments & stunning decor for every occasion.
        </p>
      </div>

      {/* Fixed left button */}
      <Link
        href="/photography"
        className="fixed top-20 left-20 bg-[#232b6e] hover:bg-blue-700 text-white py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105 z-30"
      >
        Photography
      </Link>
      
      {/* Fixed right button */}
      <Link
        href="/decor"
        className="fixed top-20 right-20 bg-[#99b50e] hover:bg-yellow-600 text-white py-3 px-6 rounded-2xl text-2lg shadow-lg transition transform hover:scale-105 z-30"
      >
        Decor
      </Link>
    </section>
  );
}

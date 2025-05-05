import Link from "next/link";

export default function Glimpse() {
    return (
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          A Glimpse of Our Services
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          From timeless studio photography to stunning event decor, we offer a range of professional services to make your moments unforgettable.
        </p>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">📸 Photography</h3>
            <p className="text-sm text-gray-600">
              Studio, outdoor, graduation, proposal shoots and more.
            </p>
            <div className="p-6">
            <h3 className="text-2xl font-semibold mb-2">Photography</h3>
            <p className="text-gray-600 mb-4">
              Capture your moments with stunning studio and field photography.
            </p>
            <Link href="/photography">
              <span className="inline-block bg-purple-600 text-white py-2 px-6 rounded-xl hover:bg-purple-700 transition">
                Explore Photography →
              </span>
            </Link>
          </div>
          </div>
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🎀 Decor Services</h3>
            <p className="text-sm text-gray-600">
              Elegant setups for weddings, baby showers, birthdays, and special events.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🛋️ Rentals</h3>
            <p className="text-sm text-gray-600">
              Rent beautiful decor items for your own DIY event styling.
            </p>
          </div>
        </div>
      </section>
    );
  }
  
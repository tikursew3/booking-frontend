import Layout from "@/components/Layout";
import Link from "next/link";
import { useServices } from "@/hooks/useServices";
import { useDecorItems } from "@/hooks/useDecorItems";

export default function ServicesPage() {
  const { data: photoServices } = useServices();
  const { data: decorItems } = useDecorItems();

  return (
    <Layout headerType="alternate">
      {/* Hero */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">Explore Our Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          From studio photography to full-scale event decor, we bring your vision to life.
        </p>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-6">
          <Link  href="/services/photography">
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition text-lg">
              📸 Photography Services
            </button>
          </Link>
          <Link  href="/services/decor">
            <button className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-xl transition text-lg">
              🎀 Decor Services
            </button>
          </Link>
        </div>
      </section>

      {/* Photography Preview */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Photography Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {photoServices?.slice(0, 3).map((service) => (
            <div key={service.id} className="bg-white shadow-md rounded-xl overflow-hidden">
              <img src={service.imageUrl} alt={service.name} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-2 truncate">{service.description}</p>
                <p className="text-gray-700 text-sm">
                  💲${service.price.toFixed(2)} | ⏱ {service.duration}
                </p>
                <Link
                  href={`/booking?bookingType=PHOTOGRAPHY&serviceId=${service.id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Book Now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services/photography">
            <button className="text-purple-700 hover:underline font-medium text-lg">View All Photography Services</button>
          </Link>
        </div>
      </section>

      {/* Decor Rental Preview */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Decor Rentals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {decorItems?.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-xl overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
                <p className="text-gray-700 text-sm">💲{item.pricePerDay.toFixed(2)} / day</p>
                <a
                  href="tel:+1234567890"
                  className="text-pink-600 hover:underline mt-2 inline-block"
                >
                  Call for Availability →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/services/decor">
            <button className="text-pink-700 hover:underline font-medium text-lg">View All Decor Services</button>
          </Link>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-purple-100 to-yellow-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Help Planning?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Book a 30-minute consultation and we’ll guide you through your options.
        </p>
        <Link href="/booking?bookingType=CONSULTATION">
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition text-lg">
            🗓️ Schedule a Consultation
          </button>
        </Link>
      </section>
    </Layout>
  );
}

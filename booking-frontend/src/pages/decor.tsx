import Layout from "@/components/Layout";
import Link from "next/link";
import { useDecorCategories } from "@/hooks/useDecorCategories";
import { DecorCategory } from "@/types/types";

import "keen-slider/keen-slider.min.css";
import Footer from "@/components/Footer";


export default function DecorPage() {
  const { data: categories, isLoading, error } = useDecorCategories();

 

  return (
    <Layout headerType="alternate">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 via-purple-100 to-yellow-100 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
          Bring Your Event to Life with Our Decor
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore stunning decor rentals and personalized services for proposals, weddings, baby showers, birthdays, and more.
        </p>

        {/* Hero Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
          <div className="flex justify-center md:justify-start w-full">
            <Link
              href="#rentals"
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-xl shadow transition w-48 text-center"
            >
              Rental
            </Link>
          </div>
          <div className="flex justify-center md:justify-end w-full">
            <Link
              href="#services"
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-xl shadow transition w-48 text-center"
            >
              Decor Services
            </Link>
          </div>
        </div>
      </section>

  {/* Rental Categories Section */}
      <section id="rentals" className="py-16 px-6 bg-white scroll-mt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Browse Decor Categories
        </h2>
        <p className="text-center text-gray-600 mb-12 animate-glow">
          Click a category to explore available rental materials.
        </p>
   
        {isLoading && <p className="text-center">Loading categories...</p>}
        {error && <p className="text-center text-red-500">Failed to load categories.</p>}


        {categories?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {Array.isArray(categories) && categories.map((cat: DecorCategory) => (
              
              <Link
                key={cat.id}
                href={`/decor/category/${cat.id}`}
                className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
              >
                <img     
                  src={cat.imageUrl || "/fallback.jpg"}
                  alt={cat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-gray-600 text-sm">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6 bg-gray-50 scroll-mt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Decor Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Not sure exactly what decor you need? Schedule a 30-minute consultation and explore our portfolio for weddings, proposals, birthdays, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service images/videos will go here */}
        </div>
        <div className="flex justify-center mt-10">
        <Link href="/booking?bookingType=CONSULTATION">
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl shadow-lg transition text-xl">
            Schedule Consultation
          </button>
        </Link>
        </div>  

      </section>
      <section>
        <Footer />
      </section>
    </Layout>
  );
}

import Layout from "@/components/Layout";
import Link from "next/link";
import { useDecorItems } from "@/hooks/useDecorItems";
import { DecorItem } from "@/types/types";

import "keen-slider/keen-slider.min.css";
import { useMemo, useState } from "react";

export default function DecorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: decorItems, isLoading, error } = useDecorItems();

  const filteredAndSortedItems = useMemo(() => {
    if (!decorItems) return [];
  
    return decorItems
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const valA = sortBy === "name" ? a.name.toLowerCase() : a.pricePerDay;
        const valB = sortBy === "name" ? b.name.toLowerCase() : b.pricePerDay;
  
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [decorItems, searchQuery, sortBy, sortOrder]);


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

    {/* Rental Section */}
      <section id="rentals" className="py-16 px-6 bg-white scroll-mt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Rent Decor Materials
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our beautiful decor pieces available for rental. Call us for availability.
        </p>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="🔍 Search decor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/2"
          />

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "price")}
              className="border px-4 py-2 rounded w-full md:w-48"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border px-4 py-2 rounded w-full md:w-40"
            >
              <option value="asc">⬆ Ascending</option>
              <option value="desc">⬇ Descending</option>
            </select>
          </div>
        </div>

        {/* Grid layout */}
        {isLoading && <p className="text-center">Loading decor items...</p>}
        {error && <p className="text-red-500 text-center">Failed to load decor items.</p>}

        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedItems.map((item: DecorItem) => (
              <div key={item.id} className="border rounded-2xl shadow hover:shadow-lg transition overflow-hidden bg-white">
                <img
                  src={item.imageUrls?.[0] || "/fallback.jpg"}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <p className="font-bold mb-4">
                    Price per day: ${item.pricePerDay.toFixed(2)}
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="w-full block bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-xl text-center transition text-lg"
                  >
                    Call for Availability
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No decor items found.</p>
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
    </Layout>
  );
}

// pages/decor/category/[id].tsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useDecorItemsByCategory } from "@/hooks/useDecorItemsByCategory";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DecorItemsByCategoryPage() {
  const router = useRouter();
  const categoryId = router.query.id as string;

  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // New: Date range
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  // Format dates to ISO string
 // const startISO = startDate?.toISOString();
  //const endISO = endDate?.toISOString();
  const shouldFetch = !!(categoryId && startDate && endDate);

  // Fetch items with selected dates
  const {
  data: items,
  isLoading,
  error,
  refetch,
} = useDecorItemsByCategory(
  shouldFetch ? categoryId : undefined,
  shouldFetch ? startDate : undefined,
  shouldFetch ? endDate : undefined
);

  // Refetch when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate]);

  const filteredItems = showOnlyAvailable
    ? items?.filter((item) => item.availableQuantity > 0)
    : items;

  return (
    <Layout headerType="alternate">
      <section className="py-16 px-6 bg-white">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Rental Items
        </h1>

        {/* Date Range Pickers */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="border rounded px-3 py-2 w-48"
              placeholderText="Start Date"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              className="border rounded px-3 py-2 w-48"
              placeholderText="End Date"
            />
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6 text-center">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
              className="form-checkbox h-5 w-5 text-pink-600"
            />
            <span className="text-gray-700">Show Only Available</span>
          </label>
        </div>

        {/* Results */}
        {isLoading && <p className="text-center">Loading items...</p>}
        {error && <p className="text-center text-red-500">Failed to load items.</p>}

        {filteredItems?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl shadow hover:shadow-lg transition p-4 bg-white"
              >
                <img
                  src={item.imageUrls?.[0] || "/fallback.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-xl font-bold mt-4">{item.name}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <p className="mt-2 font-semibold">Price/Day: ${item.pricePerDay}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Available: {item.availableQuantity}
                </p>
                <button
                  disabled={item.availableQuantity === 0}
                  onClick={() =>
                    router.push({
                      pathname: "/decor/checkout",
                      query: {
                        itemId: item.id,
                        start: startDate?.toISOString(),
                        end: endDate?.toISOString(),
                      },
                    })
                  }
                  className={`mt-4 px-4 py-2 rounded w-full text-white transition ${
                    item.availableQuantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {item.availableQuantity === 0 ? "Out of Stock" : "Checkout"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-center text-gray-500">No items found.</p>
        )}
        
          <div className="flex justify-end mt-6">
            <button
              onClick={() => router.back()}
              className="bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-md shadow transition"
            >
              ← Go Back
            </button>
          </div>
       
      </section>
    </Layout>
  );
}

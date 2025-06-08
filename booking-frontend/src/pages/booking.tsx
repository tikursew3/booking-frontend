"use client";
import Layout from "@/components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useServices } from "@/hooks/useServices";
import api from "@/lib/axios";
import axios from "axios";
import { BookingCalendarEventDTO } from "@/types/types";

export default function Booking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingType = searchParams.get("bookingType")?.toUpperCase() || "PHOTOGRAPHY";

  const { data: services } = useServices();

  const [takenSlots, setTakenSlots] = useState<{ start: string; end: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    photographyServiceId: bookingType === "PHOTOGRAPHY" ? "" : null,
    startDateTime: "",
    location: "",
    notes: "",
    bookingType,
  });

  // 🟡 Fetch all taken slots from backend (except cancelled)
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get("/api/bookings/calendar"); //booking API
        const events = res.data;
  
        const blocked = events
          .filter((e: BookingCalendarEventDTO) => e.status !== "CANCELLED") // PENDING or CONFIRMED
          .map((e: BookingCalendarEventDTO) => ({
            start: e.start,
            end: e.end,
          }));
  
        setTakenSlots(blocked);
      } catch (err) {
        console.error("Failed to fetch taken slots", err);
      }
    };
  
    fetchSlots();
  }, []);

  // Prevent selecting taken slots
  const isTimeSlotAvailable = (date: Date): boolean => {
    return !takenSlots.some((slot) => {
      const start = new Date(slot.start).setSeconds(0, 0);
      const end = new Date(slot.end).setSeconds(0, 0);
      const d = new Date(date).setSeconds(0, 0);
      return d >= start && d < end;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      if (!selectedDate) {
        setMessage("❌ Please select a date and time.");
        setLoading(false);
        return;
      }
  
      const selectedStart = new Date(selectedDate);
  
      //  Past date check
      if (selectedStart < new Date()) {
        setMessage("❌ You cannot book in the past.");
        setLoading(false);
        return;
      }
  
      // ⛔ Prevent overlapping slots
      const conflict = takenSlots.find((slot) => {
        const existingStart = new Date(slot.start);
        const existingEnd = new Date(slot.end);
        return selectedStart >= existingStart && selectedStart < existingEnd;
      });
  
      if (conflict) {
        setMessage("That time slot is already booked. Please choose another.");
        setLoading(false);
        return;
      }
  
      //  Format to local ISO (no timezone shift)
      const formatLocalDateTimeForBackend = (date: Date): string => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      };
  
      const payload = {
        ...formData,
        photographyServiceId:
          formData.bookingType === "PHOTOGRAPHY"
            ? Number(formData.photographyServiceId)
            : null,
        startDateTime: formatLocalDateTimeForBackend(selectedStart),
      };
  
      const bookingRes = await api.post("/api/bookings", payload);
  
      if (bookingType === "CONSULTATION") {
        setMessage("✅ Consultation booked successfully!");
        router.push("/consultation-success");
      } else {
        const bookingId = bookingRes.data.id;
        const depositAmount = bookingRes.data.depositAmount;
  
        const stripeRes = await api.post("/api/stripe/create-checkout-session", {
          bookingId,
          amount: depositAmount,
          bookingType: formData.bookingType, //Send booking type dynamically
        });
          
        window.location.href = stripeRes.data.checkoutUrl;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Something went wrong.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <Layout headerType="alternate">
      <main className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Book Your {bookingType === "CONSULTATION" ? "Consultation" : "Photography Session"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
          <input
            type="text"
            name="customerName"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />

          {bookingType === "PHOTOGRAPHY" && (
            <select
              name="photographyServiceId"
              value={formData.photographyServiceId || ""}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Select a Photography Service</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} (${service.price})
                </option>
              ))}
            </select>
          )}

          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setFormData((prev) => ({
                ...prev,
                startDateTime: date?.toISOString() || "",
              }));
            }}
            showTimeSelect
            timeIntervals={30}
            minDate={new Date()}
            filterTime={isTimeSlotAvailable}
            dateFormat="Pp"
            placeholderText="Select date and time"
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />

          <textarea
            name="notes"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-4 py-2"
          />

        

          <div className="mt-8 flex flex-col md:flex-row gap-6 max-w-2xl mx-auto">
            
            <div className="flex justify-center md:justify-start w-full">
              <button
                type="submit"
                disabled={loading}
                className="w--48 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition"
              >
                {loading
                  ? "Booking..."
                  : bookingType === "CONSULTATION"
                  ? "Book Consultation"
                  : "Book & Pay Deposit"}
              </button>

            </div>

            <div className="flex justify-center md:justify-end w-full">
              <Link href={bookingType === "CONSULTATION" ? "/decor" : "/photography"}>
                  
                  <button type="button" 
                    className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-xl shadow transition w-48 text-center">
                    {bookingType === "CONSULTATION" ? "Back to Decor page" : "Back to Photography page"}
                    
                  </button>
              </Link>
        
            </div>

          </div>

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.startsWith("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </main>
    </Layout>
  );
}

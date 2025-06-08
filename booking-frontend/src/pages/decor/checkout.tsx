import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/lib/axios";
import { DecorItem } from "@/types/types";
import dayjs from "dayjs";

export default function DecorCheckoutPage() {
  const router = useRouter();
  const { itemId } = router.query;

  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [item, setItem] = useState<DecorItem | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [rentalDays, setRentalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);

  useEffect(() => {
    if (itemId) {
      api.get(`/api/decor-items/${itemId}`).then((res) => {
        setItem(res.data);
      });
    }
  }, [itemId]);

  useEffect(() => {
    if (item && rentalStart && rentalEnd && quantity > 0) {
      const startDate = dayjs(rentalStart);
      const endDate = dayjs(rentalEnd);
      const days = endDate.diff(startDate, "day") + 1;
      const total = days * item.pricePerDay * quantity;
      const depositAmount = total * 0.3;

      setRentalDays(days);
      setTotalPrice(total);
      setDeposit(depositAmount);
    }
  }, [item, rentalStart, rentalEnd, quantity]);

  const handleSubmit = async () => {
    if (!name || !phone || !email || !rentalStart || !rentalEnd || !item || quantity < 1) {
      alert("Please fill in all fields.");
      return;
    }

    if (quantity > item.availableQuantity) {
      alert(`Only ${item.availableQuantity} items are available for this date.`);
      return;
    }

    try {
      setSubmitting(true);

      const bookingRes = await api.post("/api/bookings/decor-booking", {
        decorItemId: item.id,
        quantity,
        startDate: rentalStart,
        endDate: rentalEnd,
        customerName: name,
        email,
        phoneNumber: phone,
      });

      const booking = bookingRes.data;
      const bookingId = booking.bookingId; // 🟢 Fix: Use correct field

      const stripeRes = await api.post("/api/stripe/create-checkout-session", {
        bookingId,
        amount: deposit,
        bookingType: "DECOR", // 🟢 Fix: Explicitly pass booking type
      });

      window.location.href = stripeRes.data.checkoutUrl;
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: string }; message?: string };
        console.error("Booking error:", axiosError.response?.data || axiosError.message);
      } else {
        console.error("Unknown booking error:", err);
      }

      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) {
    return (
      <Layout headerType="alternate">
        <div className="py-20 text-center text-xl text-gray-700">Loading decor item...</div>
      </Layout>
    );
  }

  return (
    <Layout headerType="alternate">
      <section className="py-16 px-6 max-w-3xl mx-auto bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

        <div className="border rounded-xl shadow p-6 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <p className="mt-2 font-medium">Price per day: ${item.pricePerDay}</p>
            <p className="text-sm text-gray-500 mt-1">Available: {item.availableQuantity} units</p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block font-medium mb-1">Rental Start</label>
              <input
                type="date"
                value={rentalStart}
                onChange={(e) => setRentalStart(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Rental End</label>
              <input
                type="date"
                value={rentalEnd}
                onChange={(e) => setRentalEnd(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={item.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="mt-4 text-gray-700 text-lg space-y-1">
              <p>Rental Days: <strong>{rentalDays}</strong></p>
              <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
              <p>Deposit (30%): <strong>${deposit.toFixed(2)}</strong></p>
            </div>

            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="mt-6 bg-pink-500 text-white px-4 py-3 rounded-md hover:bg-pink-600 transition w-full text-lg font-semibold disabled:opacity-60"
            >
              {submitting ? "Redirecting to Payment..." : "Confirm & Pay Deposit"}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

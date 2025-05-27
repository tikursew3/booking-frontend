import { useEffect, useState } from "react";
import api from "@/lib/axios";
import AdminLayout from "@/components/AdminLayout";

import { Booking } from "@/types/types";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "PHOTOGRAPHY" | "CONSULTATION"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED"
  >("ALL");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCancelBooking = async (bookingId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmed) return;

    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`);

      // 🧼 Update status to 'CANCELLED', let filter logic hide it
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err) {
      console.error("Failed to cancel booking", err);
      alert("Could not cancel the booking. Please try again.");
    }
  };

  useEffect(() => {
    api
      .get<Booking[]>("/api/bookings")
      .then((res) => {
        const enriched = res.data.map((b) => ({
          ...b,
          serviceName: b.photographyService?.name || "—",
        }));
        setBookings(enriched);
      })
      .catch((err) => console.error("Failed to load bookings", err));
  }, []);

  return (
    <AdminLayout>
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <h1 className="text-2xl font-bold mb-6">📋 All Bookings</h1>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div>
              <label className="mr-2 text-gray-700 font-medium">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value as "ALL" | "PHOTOGRAPHY" | "CONSULTATION"
                  )
                }
                className="border rounded px-3 py-1"
              >
                <option value="ALL">All</option>
                <option value="PHOTOGRAPHY">📸 Photography</option>
                <option value="CONSULTATION">💬 Consultation</option>
              </select>
            </div>

            <div className="">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3 py-1 rounded"
              />
            </div>

            <div className="">
              <label className="mr-2 text-gray-700 font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "ALL"
                      | "CONFIRMED"
                      | "PENDING"
                      | "CANCELLED"
                  )
                }
                className="border rounded px-3 py-1"
              >
                <option value="ALL">All</option>
                <option value="PENDING">🟠 Pending</option>
                <option value="CONFIRMED">✅ Confirmed</option>

                <option value="CANCELLED">❌ Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl w-full overflow-x-auto">
            <table className="w-full min-w-full table-auto border-collapse overflow-x-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Start Time</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter(
                    (b) =>
                      (typeFilter === "ALL" || b.bookingType === typeFilter) &&
                      (statusFilter === "ALL" || b.status === statusFilter) &&
                      (b.customerName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        b.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()))
                  )

                  .map((b) => (
                    <tr key={b.id} className="border-t">
                      <td className="p-3">{b.customerName}</td>
                      <td className="p-3">{b.email}</td>
                      <td className="p-3">{b.phoneNumber}</td>
                      <td className="p-3">{b.bookingType}</td>
                      <td className="p-3">{b.status}</td>
                      <td className="p-3">
                        {new Date(b.startDateTime).toLocaleString()}
                      </td>
                      <td className="p-3">{b.serviceName || "—"}</td>

                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => setEditingBooking(b)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        {(b.status === "PENDING" ||
                          b.status === "CONFIRMED") && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {editingBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const updated = {
                          customerName: editingBooking.customerName,
                          email: editingBooking.email,
                          phoneNumber: editingBooking.phoneNumber,
                          startDateTime: editingBooking.startDateTime,
                          endDateTime: editingBooking.endDateTime,
                          location: editingBooking.location,
                          notes: editingBooking.notes,
                        };
                        await api.put(
                          `/api/bookings/${editingBooking.id}`,
                          updated
                        );
                        setBookings((prev) =>
                          prev.map((b) =>
                            b.id === editingBooking.id
                              ? { ...b, ...updated }
                              : b
                          )
                        );
                        setEditingBooking(null);
                      } catch (err) {
                        alert("Failed to update booking");
                        console.error(err);
                      }
                    }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      value={editingBooking.customerName}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-2"
                      required
                    />
                    <input
                      type="email"
                      value={editingBooking.email}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          email: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      value={editingBooking.phoneNumber}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-2"
                      required
                    />
                    <input
                      type="datetime-local"
                      value={editingBooking.startDateTime.slice(0, 16)}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        const newEnd = new Date(
                          new Date(newStart).getTime() + 30 * 60000
                        ).toISOString();
                        setEditingBooking({
                          ...editingBooking,
                          startDateTime: newStart,
                          endDateTime: newEnd,
                        });
                      }}
                      className="w-full border rounded px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      value={editingBooking.location || ""}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          location: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-2"
                    />
                    <textarea
                      value={editingBooking.notes || ""}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          notes: e.target.value,
                        })
                      }
                      className="w-full border rounded px-4 py-2"
                      rows={3}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingBooking(null)}
                        className="px-4 py-2 border rounded-lg text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

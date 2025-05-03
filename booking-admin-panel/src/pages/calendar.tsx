import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";

import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import AdminLayout from "@/components/AdminLayout";
import { BookingCalendarEventDTO } from "@/types/types";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  status: string;
  bookingType: string;
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [filter, setFilter] = useState<"ALL" | "PHOTOGRAPHY" | "CONSULTATION">(
    "ALL"
  );
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "CONFIRMED" | "PENDING"
  >("ALL");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get<BookingCalendarEventDTO[]>(
          "/api/bookings/calendar"
        );

        const transformed = res.data.map((event) => ({
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          status: event.status,
          bookingType: event.bookingType,
        }));

        setEvents(transformed);
      } catch (error) {
        console.error("Failed to load calendar events", error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchType = filter === "ALL" || e.bookingType === filter;
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchType && matchStatus;
  });

  return (
    <AdminLayout>
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <h1 className="text-2xl font-bold mb-6">📅 Booking Calendar</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <label className="mr-2 font-medium">Type:</label>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as "ALL" | "PHOTOGRAPHY" | "CONSULTATION"
                  )
                }
                className="border px-3 py-1 rounded"
              >
                <option value="ALL">All</option>
                <option value="PHOTOGRAPHY">📸 Photography</option>
                <option value="CONSULTATION">💬 Consultation</option>
              </select>
            </div>
            <div>
              <label className="mr-2 font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "ALL" | "CONFIRMED" | "PENDING"
                  )
                }
                className="border px-3 py-1 rounded"
              >
                <option value="ALL">All</option>
                <option value="CONFIRMED">✅ Confirmed</option>
                <option value="PENDING">🟠 Pending</option>
              </select>
            </div>
          </div>

          {/* Selected Event Popup */}
          {selectedEvent && (
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-6">
              <h2 className="text-lg font-bold">{selectedEvent.title}</h2>
              <p>
                <strong>Type:</strong> {selectedEvent.bookingType} <br />{" "}
                <strong>Status:</strong> {selectedEvent.status}
              </p>
              <p>
                {selectedEvent && selectedEvent.start && (
                  <p>
                    <strong>Start:</strong>{" "}
                    {selectedEvent.start.toLocaleString()}
                  </p>
                )}
                {selectedEvent && selectedEvent.end && (
                  <p>
                    <strong>End:</strong> {selectedEvent.end.toLocaleString()}
                  </p>
                )}
              </p>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
              >
                Close
              </button>
            </div>
          )}

          {/* Calendar */}
          <div style={{ height: "80vh" }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(e) => setSelectedEvent(e)}
              style={{
                height: "100%",
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1rem",
              }}
              eventPropGetter={(event) => {
                const bgColor =
                  event.status === "CONFIRMED"
                    ? "#34d399"
                    : event.status === "PENDING"
                    ? "#fbbf24"
                    : "#60a5fa";
                return {
                  style: {
                    backgroundColor: bgColor,
                    color: "white",
                    borderRadius: "6px",
                    padding: "4px 6px",
                  },
                };
              }}
            />
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

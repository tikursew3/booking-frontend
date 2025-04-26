import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";

import api from "@/lib/axios";
import { enUS } from "date-fns/locale/en-US";
import { BookingCalendarEventDTO } from "@/types/types";
import { CalendarEvent } from "@/types/types";
import Layout from "@/components/Layout";

// Set up date-fns localizer
const locales = {
    "en-US": enUS,
  };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



export default function BookingCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PHOTOGRAPHY" | "CONSULTATION">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "PENDING">("ALL");



  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("api/bookings/calendar");  
        const data = res.data.map((event: BookingCalendarEventDTO) => ({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            status: event.status,
            bookingType: event.bookingType,
          }));
        setEvents(data);
      } catch (error) {
        console.error("Failed to load calendar events", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Layout headerType="alternate">
    <main className="py-18 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 Booking Calendar</h1>
      <div style={{ height: "80vh" }}>

            {selectedEvent && (
                <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 mb-6 shadow-md text-center">
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">{selectedEvent.title}</h2>
                    <p className="text-gray-600">
                    <strong>Type:</strong> {selectedEvent.bookingType} &nbsp;&nbsp;
                    <strong>Status:</strong> {selectedEvent.status}
                    </p>
                    <p className="text-gray-600">
                    <strong>Start:</strong> {selectedEvent.start.toLocaleString()}<br />
                    <strong>End:</strong> {selectedEvent.end.toLocaleString()}
                    </p>
                    <button
                    onClick={() => setSelectedEvent(null)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
                    >
                    Close
                    </button>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
  {/* Booking Type Filter */}
  <div>
    <label className="mr-2 font-medium text-gray-700">Type:</label>
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value as "ALL" | "PHOTOGRAPHY" | "CONSULTATION")}
      className="border border-gray-300 rounded px-3 py-1"
    >
      <option value="ALL">All</option>
      <option value="PHOTOGRAPHY">📸 Photography</option>
      <option value="CONSULTATION">💬 Consultation</option>
    </select>
  </div>

  {/* Status Filter */}
  <div>
    <label className="mr-2 font-medium text-gray-700">Status:</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value as "ALL" | "CONFIRMED" | "PENDING")}
      className="border border-gray-300 rounded px-3 py-1"
    >
      <option value="ALL">All</option>
      <option value="CONFIRMED">✅ Confirmed</option>
      <option value="PENDING">🟠 Pending</option>
    </select>
  </div>
</div>




            <Calendar
                    onSelectEvent={(event) => {
                        setSelectedEvent(event);
                        
                    }}
                
                    localizer={localizer}
                    //filter events based on the selected filter and before rendering
                    events={
                        events.filter((e) => {
                          const matchesType = filter === "ALL" || e.bookingType === filter;
                          const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
                          return matchesType && matchesStatus;
                        })
                      }
                      
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", borderRadius: "12px", backgroundColor: "white", padding: "1rem" }}
                    eventPropGetter={(event) => {
                        let bgColor = "#60a5fa";
                        if (event.status === "CONFIRMED") bgColor = "#34d399"; // green
                        if (event.status === "PENDING") bgColor = "#fbbf24"; // amber

                        return {
                        style: {
                            backgroundColor: bgColor,
                            borderRadius: "6px",
                            color: "white",
                            border: "none",
                            display: "block",
                            padding: "2px 6px"
                        }
                        };
                    }}
            />
      </div>
    </main>
    </Layout>
  );
}

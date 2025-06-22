import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  DashboardSummary,
  ServiceBookingData,
  BookingCalendarEventDTO,
} from "@/types/types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});  

export default function Dashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<ServiceBookingData[]>([]);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<
    "ALL" | "PHOTOGRAPHY" | "CONSULTATION" | "DECOR"
  >("ALL");
  const [calendarEvents, setCalendarEvents] = useState<
    BookingCalendarEventDTO[]
  >([]);
  const [selectedEvent, setSelectedEvent] =
    useState<BookingCalendarEventDTO | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarKey, setCalendarKey] = useState(0);

  //  1. Check authentication before rendering anything
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/admin-auth-check");
        setAuthChecked(true);
      } catch {
        router.push("/admin/login");
      }
    };    

    checkAuth();
  }, []);

  //  3. Load calendar events
  useEffect(() => {
    if (!authChecked) return;

    api   
      .get<BookingCalendarEventDTO[]>("/api/bookings/calendar")
      .then((res) => setCalendarEvents(res.data))
      .catch((err) => console.error("Failed to load calendar data", err));
  }, [authChecked]);

  //  4. Load dashboard summary
  useEffect(() => {
    if (!authChecked) return;

    api
      .get<DashboardSummary>("/api/bookings/dashboard-summary")
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard summary", err);
        setLoading(false);
      });
  }, [authChecked]);

  //  5. Load service booking chart
  useEffect(() => {
    if (!authChecked) return;

    api
      .get<ServiceBookingData[]>("/api/bookings/bookings-by-service")
      .then((res) => setServiceData(res.data))
      .catch((err) =>
        console.error("Failed to load service booking chart data", err)
      );
  }, [authChecked]);

  // Safe to place conditional return here — AFTER all hooks
  //Protect rendering until authenticated
  if (!authChecked) {
    return <div className="p-8">Checking authentication...</div>;
  }

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!summary)
    return <div className="p-8 text-red-500">Failed to load summary.</div>;

  return (
    <AdminLayout>
      <main className="flex-1 p-4 bg-gray-100 overflow-x-hidden">
        <div className="w-full max-w-full md:max-w-4xl mx-auto overflow-x-hidden">
          <h1 className="text-[#47545c] text-3xl font-bold mb-8 text-center">
            📊 Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full overflow-x-hidden">
            <Card title="📅 Total Bookings" value={summary.totalBookings} />
            <Card title="✅ Confirmed" value={summary.confirmedBookings} />
            <Card title="🟠 Pending" value={summary.pendingBookings} />
            <Card title="❌ Cancelled" value={summary.cancelledBookings} />
            <Card title="📸 Photography" value={summary.photographyCount} />
            <Card title="🎀  Decor" value={summary.decorCount} />
            <Card title="💬 Consultations" value={summary.consultationCount} />
            <Card
              title="💰 Total Payments"
              value={`$${summary.totalPayments.toFixed(2)}`}
            />
          </div>

          <h2 className="text-[#47545c] text-2xl font-semibold mt-16 mb-4 text-center w-full max-w-full overflow-hidden">
            Bookings by Service
          </h2>

          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="serviceName"
                tickFormatter={(name) => {
                  const lower = name?.toLowerCase() || "";
                  if (lower.includes("decor")) return "🎀 Decor Rental";
                  if (lower.includes("consultation")) return "💬 Consultation";
                  if (lower.includes("photography")) return "📸 " + name;
                  return name || "Unknown";
                }}
              />  
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  fill="#8884d8"
                >
                  {serviceData.map((entry, index) => {
                    const name = entry.serviceName?.toLowerCase() || "";
                    let fillColor = "#8884d8"; // default

                    if (name.includes("decor")) {
                      fillColor = "#3f8021"; // light green
                    } else if (name.includes("consultation")) {
                      fillColor = "#2d7ab5"; // light blue
                    } else if (name.includes("photography")) {
                      fillColor = "#e61942"; // red
                    }

                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-[#47545c] text-2xl font-semibold mt-16 mb-4 text-center w-full max-w-full overflow-hidden">
            🗓️ Upcoming Bookings
          </h2>
          <div className="text-[#47545c] mb-4 flex justify-end w-full max-w-full overflow-hidden">
            <select
              value={bookingTypeFilter}
              onChange={(e) =>
                setBookingTypeFilter(
                  e.target.value as "ALL" | "PHOTOGRAPHY" | "CONSULTATION" | "DECOR"
                )
              }
              className="border px-3 py-2 rounded-md shadow-sm"
            >
              <option value="ALL">📋 All Bookings</option>
              <option value="PHOTOGRAPHY">📸 Photography</option>
              <option value="CONSULTATION">💬 Consultation</option>
              <option value="DECOR">🎀 Decor </option>
            </select>
          </div>

          <div className="h-[600px] bg-white p-4 rounded-xl shadow w-full max-w-full overflow-hidden">
            <Calendar
              key={calendarKey}
              localizer={localizer}
              events={calendarEvents
                .filter((e) =>
                  bookingTypeFilter === "ALL"
                    ? true
                    : e.bookingType === bookingTypeFilter
                )
                .map((e) => ({
                  ...e,
                  start: new Date(e.start),
                  end: new Date(e.end),
                }))}
              startAccessor="start"
              endAccessor="end"
              view={calendarView}
              onView={(view) => {
                if (view === "month" || view === "week") {
                  setCalendarView(view);
                }
              }}
              date={currentDate}
              onNavigate={(date, view, action) => {
                if (action === "TODAY") {
                  const now = new Date();
                  setCurrentDate(now);
                  setCalendarKey((prev) => prev + 1);
                } else {
                  setCurrentDate(date);
                }
              }}
              defaultView="month"
              views={["month", "week"]}
              tooltipAccessor={(event) =>
                `${event.title} - ${event.bookingType}`
              }
              eventPropGetter={(event) => {
                let bgColor = "#3b82f6";
                if (event.status === "CONFIRMED") bgColor = "#10b981";
                else if (event.status === "PENDING") bgColor = "#f59e0b";
                else if (event.status === "CANCELLED") bgColor = "#ef4444";
                return {
                  style: {
                    backgroundColor: bgColor,
                    color: "white",
                    borderRadius: "6px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                  },
                };
              }}
              onSelectEvent={(event) => setSelectedEvent(event)}
              style={{ height: "100%" }}
            />

            {selectedEvent && (
              <div className="text-[#47545c] w-full max-w-full overflow-hidden fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                  <p>
                    <strong>📌 Type:</strong> {selectedEvent.bookingType}
                  </p>
                  <p>
                    <strong>📅 Start:</strong>{" "}
                    {new Date(selectedEvent.start).toLocaleString()}
                  </p>
                  <p>
                    <strong>🕓 End:</strong>{" "}
                    {new Date(selectedEvent.end).toLocaleString()}
                  </p>
                  <p>
                    <strong>📌 Status:</strong> {selectedEvent.status}
                  </p>
                  <p>
                    <strong>🧾 Title:</strong> {selectedEvent.title}
                  </p>
                  <div className="mt-6 text-right">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="mb-2 text-4xl group-hover:scale-110 transition-transform duration-300">
        {title.slice(0, 2)}
      </div>
      <h2 className="text-base sm:text-lg font-medium text-gray-600 mb-1">
        {title.slice(2).trim()}
      </h2>
      <p className="text-2xl sm:text-3xl font-bold text-blue-700">{value}</p>
    </div>
  );
}   


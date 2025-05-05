export default function OperationalHours() {
    return (
      <section className="py-16 px-6 bg-white text-center border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Operational Hours</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We’re open and ready to serve you during the following hours:
        </p>
  
        <div className="max-w-md mx-auto text-left">
          <ul className="space-y-4 text-gray-700">
            <li className="flex justify-between border-b pb-2">
              <span>Monday – Friday</span>
              <span>9:00 AM – 6:00 PM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Saturday</span>
              <span>10:00 AM – 4:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span className="text-red-500 font-medium">Closed</span>
            </li>
          </ul>
        </div>
      </section>
    );
  }
  
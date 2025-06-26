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
            
            <li className="flex justify-between">
              <span>Saturday and Sunday</span>
              <span className="text-red-500 font-medium">Closed only for Photgraphy</span>
            </li>
          </ul>
        </div>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2834.444057112384!2d-93.23879939999999!3d44.730956600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f630b55d41a085%3A0xa5d864b14b5ceeef!2s980%20Garden%20View%20Dr%2C%20Apple%20Valley%2C%20MN%2055124!5e0!3m2!1sen!2sus!4v1749590111283!5m2!1sen!2sus" 
            width="100%"
            height="120"
            className="rounded border-none"
            allowFullScreen
            loading="lazy"
          ></iframe>
      </section>
    );
  }
  
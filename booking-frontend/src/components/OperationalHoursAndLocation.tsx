

export default function OperationalHoursAndLocation() {
    {/* Operational Hours + Location */}
    return (
        <div>
          <h3 className="text-xl md:text-xxl font-bold text-white border-b-2 border-gray-300 pb-2 w-full md:w-fit">
            ⏰ Hours & Location
          </h3>
          <p className="text-lg">Mon - Fri: 9:00 AM - 6:00 PM</p>
          <p className="text-lg">Sat: 10:00 AM - 6:00 PM</p>
          <p className="text-lg mb-4">Sun: Closed</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2834.444057112384!2d-93.23879939999999!3d44.730956600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f630b55d41a085%3A0xa5d864b14b5ceeef!2s980%20Garden%20View%20Dr%2C%20Apple%20Valley%2C%20MN%2055124!5e0!3m2!1sen!2sus!4v1749590111283!5m2!1sen!2sus" 
            width="100%"
            height="120"
            className="rounded border-none"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
    );

}
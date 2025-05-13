import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
      
      <p className="text-lg mb-6 text-gray-700 text-center">
        Welcome to <span className="font-semibold">Eden Photo and Decor</span>, where creativity meets professionalism.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-2">📸 Photography Services</h2>
          <p className="text-gray-700">
            Whether you are celebrating a milestone, welcoming a newborn, graduating, proposing, or simply cherishing a moment—
            our photography services are tailored to meet your needs. We offer:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Studio and field photography</li>
            <li>Themed sessions for babies, graduates, and couples</li>
            <li>Professional editing and high-resolution digital delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">🎉 Decor Services</h2>
          <p className="text-gray-700">
            Let us help you elevate your events with stunning decor solutions. We offer:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Consultation appointments to plan your decor needs</li>
            <li>Rental of materials like backdrops, floral pieces, and table centerpieces</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">💡 Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Seamless online booking</li>
            <li>Transparent pricing and service details</li>
            <li>Friendly, professional staff</li>
            <li>Personalized experiences for every client</li>
            <li>Flexible consultation and rental options</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We believe every client deserves an experience that’s as special as the moments they’re celebrating.
            Let us be a part of your story.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

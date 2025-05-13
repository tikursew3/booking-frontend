import React from "react";
import Layout from "@/components/Layout";

const AboutPage = () => {
  return (
    <Layout headerType="alternate">
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-4 font-serif">
            About Us
          </h1>
          <p className="text-xl text-center text-gray-700 mb-12">
            Welcome to <span className="font-bold text-pink-600">Eden Photo and Decor</span>, 
            where creativity meets professionalism.
          </p>

          <div className="space-y-12">
            {/* Photography Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-3">📸 Photography Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Whether you are celebrating a milestone, welcoming a newborn, graduating, proposing, or simply cherishing a moment—
                our photography services are tailored to meet your needs. We offer:
              </p>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
                <li>Studio and field photography</li>
                <li>Themed sessions for babies, graduates, and couples</li>
                <li>Professional editing and high-resolution digital delivery</li>
              </ul>
            </section>

            {/* Decor Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-pink-600 mb-3">🎉 Decor Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Let us help you elevate your events with stunning decor solutions. We offer:
              </p>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
                <li>Consultation appointments to plan your decor needs</li>
                <li>Rental of materials like backdrops, floral pieces, and table centerpieces</li>
              </ul>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-purple-700 mb-3">💡 Why Choose Us?</h2>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
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
      </div>
    </Layout>
  );
};

export default AboutPage;

import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

const AboutPage = () => {
  return (
    <Layout headerType="alternate">
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-4 pt-3 font-serif">
            About Us
          </h1>
          <p className="text-xl text-center text-gray-700 mb-12">
            Welcome to{" "}
            <span className="font-bold text-pink-600">
              Eden Photo and Decor
            </span>
            , where creativity meets professionalism.
          </p>

          <div className="space-y-12">
            {/* Photography Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-3">
                📸 Photography Services
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Whether you are celebrating a milestone, welcoming a newborn,
                graduating, proposing, or simply cherishing a moment— our
                photography services are tailored to meet your needs. We offer:
              </p>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
                <li>Studio and field photography</li>
                <li>Themed sessions for babies, graduates, and couples</li>
                <li>
                  Professional editing and high-resolution digital delivery
                </li>
              </ul>
            </section>

            {/* Decor Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-pink-600 mb-3">
                🎉 Decor Services
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Let us help you elevate your events with stunning decor
                solutions. We offer:
              </p>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
                <li>Consultation appointments to plan your decor needs</li>
                <li>
                  Rental of materials like backdrops, floral pieces, and table
                  centerpieces
                </li>
              </ul>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-purple-700 mb-3">
                💡 Why Choose Us?
              </h2>
              <ul className="list-disc list-inside text-gray-800 mt-3 pl-4 space-y-1">
                <li>Seamless online booking</li>
                <li>Transparent pricing and service details</li>
                <li>Friendly, professional staff</li>
                <li>Personalized experiences for every client</li>
                <li>Flexible consultation and rental options</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We believe every client deserves an experience that’s as special
                as the moments they’re celebrating. Let us be a part of your
                story.
              </p>
            </section>
          </div>
        </div>
      </div>
      {/* Quick Links Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Links
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" passHref>
            <span className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium px-4 py-2 rounded-lg transition">
              Home
            </span>
          </Link>

          <Link href="/photography" passHref>
            <span className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium px-4 py-2 rounded-lg transition">
              Photography
            </span>
          </Link>

          <Link href="/decor" passHref>
            <span className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium px-4 py-2 rounded-lg transition">
              Decor
            </span>
          </Link>

          <Link href="/contact" passHref>
            <span className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium px-4 py-2 rounded-lg transition">
              Contact Us
            </span>
          </Link>

          <Link href="/booking" passHref>
            <span className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 font-medium px-4 py-2 rounded-lg transition">
              Book Now
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

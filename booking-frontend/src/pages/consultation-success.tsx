import Link from "next/link";
import Layout from '@/components/Layout';

export default function ConsultationSuccess() {
  return (
    <Layout headerType="alternate">
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-center px-4 py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
        🎉 Consultation Booked!
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6">
        Thank you for scheduling your decor consultation. We’re excited to help bring your vision to life!
      </p>

      <p className="text-md text-gray-600 mb-8">
        Our team will contact you shortly with more details. Please check your email for confirmation.
      </p>

      <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition shadow">
        Back to Home
      </Link>
    </div>
    </Layout>
  );
}

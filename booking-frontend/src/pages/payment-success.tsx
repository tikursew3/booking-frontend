import Link from 'next/link';
import Layout from '@/components/Layout';

export default function PaymentSuccess() {
  return (
    <Layout headerType="alternate">
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful! 🎉</h1>
      <p className="text-xl text-gray-700 mb-6">
        Thank you for your booking. Your payment has been confirmed.
      </p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl text-lg transition"
      >
        Go Back Home
      </Link>
    </div>
    </Layout>
  );
}

import Link from 'next/link';
import Layout from '@/components/Layout';

export default function PaymentCancel() {
  return (
    <Layout headerType="alternate">
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Canceled ❌</h1>
      <p className="text-xl text-gray-700 mb-6">
        It looks like you canceled the payment. If this was a mistake, you can try again.
      </p>
      <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl text-lg transition"
      >
        Go Back Home
      </Link>
    </div>
    </Layout>
  );
}

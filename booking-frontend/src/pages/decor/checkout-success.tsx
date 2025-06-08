import Layout from "@/components/Layout";

export default function DecorCheckoutSuccessPage() {
  return (
    <Layout headerType="alternate">
      <section className="py-24 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Booking Confirmed 🎉</h1>
        <p className="text-lg text-gray-700">We’ve received your decor rental request. We will be in touch soon!</p>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import Layout from "@/components/Layout";
import api from "@/lib/axios";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.post("api/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending contact message", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout headerType="alternate">
      <main className="min-h-screen py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* LEFT SIDE - Contact Info */}
          <div className="bg-gradient-to-b from-purple-500 to-pink-400 text-white p-10">
            <h2 className="text-4xl font-bold mb-4">📍 Get in Touch</h2>
            <p className="mb-6 text-2xl text-white/90">
              We would love to hear from you. Whether you have a question or just want to say hi 👋
            </p>

            <div className="space-y-4 text-white">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-200" />
                <a href="mailto:hello@passion2code.com" className="text-2xl hover:underline">
                  hello@passion2code.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-200" />
                <a href="tel:+1234567890" className="text-2xl hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3 text-2xl">
                <MapPin className="w-5 h-5  text-red-200" />
                <span>123 Creative Lane, Cityville, NY</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-8">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-30 h-15 text-white hover:text-blue-900 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-30 h-15 text-white hover:text-blue-900 transition" />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - Contact Form */}
          <div className="p-10">
            <h3 className="text-4xl font-bold mb-6">Contact Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full border px-4 py-2 rounded"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full border px-4 py-2 rounded"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full border px-4 py-2 rounded"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-2xl py-2 px-6 rounded-xl transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-green-600 font-medium mt-2">
                  ✅ Message sent successfully! <br/> We will get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 font-medium mt-2">
                  ❌ Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}

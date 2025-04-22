import { useServices } from '@/hooks/useServices';
import { motion } from 'framer-motion';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Layout from '@/components/Layout';
import PhotographyCard from '@/components/PhotographyCard';


export default function Photography() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) return <div className="p-4">Loading services...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load services.</div>;

  
  return (
    <Layout headerType="alternate">
    <main className="pt-20 pb-10 px-6 bg-[#d184b9]">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Photography Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services?.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
        >
          <PhotographyCard service={service} />
        </motion.div>
      ))}
      </div>
    </main>
    </Layout>
  );
}
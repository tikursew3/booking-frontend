import { Carousel } from 'react-responsive-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { PhotographyService } from '@/types/types';

export default function PhotographyCard({ service }: { service: PhotographyService }) {
  const imagesToShow = service.images ?? [];
  return (
    <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="border rounded-2xl shadow-md overflow-hidden bg-white"
  >
      <div className="relative">
      <Carousel
  showThumbs={false}
  infiniteLoop
  showStatus={false}
  showIndicators={true}
  autoPlay
  interval={5000}
  stopOnHover
  swipeable
  renderArrowPrev={(onClickHandler, hasPrev, label) =>
    hasPrev && (
      <button
        onClick={onClickHandler}
        title={label}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-20"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
    )
  }
  renderArrowNext={(onClickHandler, hasNext, label) =>
    hasNext && (
      <button
        onClick={onClickHandler}
        title={label}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-20"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    )
  }
  renderIndicator={(onClickHandler, isSelected, index, label) => {
    const className = isSelected
      ? "w-3 h-3  bg-blue-600 rounded-full mx-1 transition-all duration-300"
      : "w-3 h-3  bg-gray-300 rounded-full mx-1 cursor-pointer hover:bg-gray-500 transition-all duration-300";

    return (
      <li
        className={className}
        onClick={onClickHandler}
        key={index}
        role="button"
        aria-label={`${label} ${index + 1}`}
      />
    );
  }}
>
{imagesToShow.map((imgUrl, index) => (
            <div key={index}>
              <img
                src={imgUrl}
                alt={`${service.name} ${index + 1}`}
                className="h-100 object-cover w-full"
              />
            </div>
          ))}
</Carousel>

    </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold">{service.name}</h2>
        <p className="text-gray-600 text-sm mt-2">{service.description}</p>
        <p className="mt-3 text-lg font-bold">${service.price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm">Deposit: ${service.depositAmount.toFixed(2)}</p>
        <p className="text-gray-500 text-sm mb-4">Duration: {service.duration}</p>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition text-lg"
          onClick={() => window.location.href = `/booking?serviceId=${service.id}`}
        >
          Book Now
        </button>
      </div>
      </motion.div>
  );
}



export interface BookingCalendarEventDTO {
    title: string;
    start: string | Date;
    end: string | Date;
    status: string;
    bookingType: string;
  }
  

 export interface Booking {
  id: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  bookingType: string;
  status: string;
  startDateTime: string;
  endDateTime: string; // ✅ Add this line
  photographyService?: {
    name: string;
  };
  serviceName?: string;
  location?: string;
  notes?: string;
}

export interface DashboardSummary {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  consultationCount: number;
  photographyCount: number;
  decorCount: number;
  totalPayments: number;
}

export interface ServiceBookingData {
  serviceName: string;
  count: number;
}

// src/types/types.ts
export interface PhotographyService {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  depositAmount: number;
  duration: string;
  active: boolean;
}

export interface DecorItem {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  pricePerDay: number;
  totalQuantity: number;
  category: DecorCategory;
  active: boolean;
}

export interface DecorCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

export type DecorItemCreateDTO = {
  name: string;
  description: string;
  pricePerDay: number;
  totalQuantity: number;
  active: boolean;
  imageUrls: string[];
  categoryId: number;
};
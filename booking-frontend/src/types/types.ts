export interface PhotographyService {
    id: number;
    name: string;
    description: string;
    price: number;
    depositAmount: number;
    duration: string;
    imageUrls: string[];
    active: boolean;
  }
     
  export interface DecorItem {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  imageUrls: string[];
  active: boolean;
  totalQuantity: number;
  availableQuantity: number; 
  decorCategoryId: number;  
}

export interface DecorItemWithAvailabilityDTO {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  imageUrls: string[];
  availableQuantity: number;
}
  
  export interface BookingCalendarEventDTO {
    title: string;
    start: string;
    end: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    bookingType: "PHOTOGRAPHY" | "CONSULTATION" | "DECOR";
  }

 // Define event type
  export interface CalendarEvent extends Event {
   title: string;
   start: Date;
   end: Date;
   status: string;
   bookingType: string;
 }

 export interface BlockedSlot {
  start: string;
  end: string;
}


export interface DecorCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
}



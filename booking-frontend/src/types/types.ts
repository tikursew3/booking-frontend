export interface PhotographyService {
    id: number;
    name: string;
    description: string;
    price: number;
    depositAmount: number;
    duration: string;
    imageUrl: string;
    images: string[];
    active: boolean;
  }

  export interface DecorItem {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    
    imageUrls: string[];
    active: boolean;
  }
  
  export interface BookingCalendarEventDTO {
    title: string;
    start: string;
    end: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    bookingType: "PHOTOGRAPHY" | "CONSULTATION";
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



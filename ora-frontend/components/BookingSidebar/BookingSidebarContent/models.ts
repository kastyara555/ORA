export interface BookingMaster extends ResponseBookingMaster {
  mainImage: string;
}

export interface ResponseBookingMaster {
  id: number;
  name: string;
  mainImage: string | null;
  price: number;
}

export interface BookingRecord {
  id: number;
  time: string;
}

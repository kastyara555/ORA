import { FC, useEffect } from "react";

import axiosInstance from "@/api";
import { getAvailableDatesBySaloonAndProcedureUrl } from "@/api/serviceInstance";
import { BookingBannerDataModel } from "@/store/common/model";

interface BookingSidebarContentProps {
  data: BookingBannerDataModel;
}

const BookingSidebarContent: FC<BookingSidebarContentProps> = ({ data }) => {
  const fetchAvailableDates = async () => {
    const { data: availableDates } = await axiosInstance.post(
      getAvailableDatesBySaloonAndProcedureUrl(data.idSalon, data.idProcedure),
      {
        month: 5,
        year: 2024,
      }
    );
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  return (
    <div>
      <h2>Sidebar</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </div>
  );
};
export default BookingSidebarContent;

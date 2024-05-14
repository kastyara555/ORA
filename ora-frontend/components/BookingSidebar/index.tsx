import { BookingBannerDataModel } from "@/store/common/model";
import { Sidebar } from "primereact/sidebar";
import { FC } from "react";

import BookingSidebarContent from "@/components/BookingSidebar/BookingSidebarContent";

interface BookingSidebarProps {
  data: BookingBannerDataModel | null;
  onClose(): void;
}

const BookingSidebar: FC<BookingSidebarProps> = ({ data, onClose }) => (
  <Sidebar
    visible={!!data}
    onHide={onClose}
    className="w-full md:w-30rem"
    position="right"
  >
    {!!data && <BookingSidebarContent data={data} />}
  </Sidebar>
);

export default BookingSidebar;

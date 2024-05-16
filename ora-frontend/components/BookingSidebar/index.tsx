import { BookingSidebarDataModel } from "@/store/common/model";
import { Sidebar } from "primereact/sidebar";
import classNames from "classnames";
import { FC } from "react";

import BookingSidebarContent from "@/components/BookingSidebar/BookingSidebarContent";

import styles from "./style.module.scss";

interface BookingSidebarProps {
  data: BookingSidebarDataModel | null;
  onClose(): void;
}

const BookingSidebar: FC<BookingSidebarProps> = ({ data, onClose }) => (
  <Sidebar
    visible={!!data}
    onHide={onClose}
    className={classNames(styles.sidebar, "w-full", "md:w-30rem")}
    position="right"
  >
    {!!data && <BookingSidebarContent data={data} />}
  </Sidebar>
);

export default BookingSidebar;

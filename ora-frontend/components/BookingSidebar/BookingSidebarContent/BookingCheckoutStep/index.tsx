import { FC, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { InputTextarea } from "primereact/inputtextarea";

import Button from "@/components/Button";

import { BookingMaster, BookingRecord } from "../models";
import styles from "./style.module.scss";

interface BookingCheckoutStepProps {
  date: Date;
  record: BookingRecord;
  master: BookingMaster;
  handleApply(comment: string): void;
}

const BookingCheckoutStep: FC<BookingCheckoutStepProps> = ({
  date,
  record,
  master,
  handleApply,
}) => {
  const [comment, setComment] = useState<string>("");

  const formattedDate = moment(date).format("DD.MM.YYYY");

  return (
    <div>
      <h3>Мастер:</h3>
      <div className={classNames("flex", "align-items-center", "mt-1")}>
        <img
          src={master.mainImage}
          alt={master.mainImage}
          className={classNames(styles.masterAvatar, "h-3rem", "shadow-2")}
        />
        <p className="ml-2">{master.name}</p>
      </div>
      <h3 className="mt-2">Дата:</h3>
      <p className="mt-1">{formattedDate}</p>

      <h3 className="mt-2">Время:</h3>
      <p className="mt-1">{record.time}</p>

      <InputTextarea
        className={classNames("mt-2", "w-full")}
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={5}
        cols={30}
      />

      <Button
        className={classNames("w-full", "mt-4")}
        onClick={() => handleApply(comment)}
      >
        Записаться
      </Button>
    </div>
  );
};

export default BookingCheckoutStep;

import { FC } from "react";
import moment from "moment";
import classNames from "classnames";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import Link from "next/link";

import { ProfileClientHistoryModel } from "@/models/profile";
import { DAYS_OF_WEEK } from "@/consts";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";
import { BASE_STATIC_URL, BASE_URL_FRONT } from "@/api";

import styles from "./style.module.scss";

interface BookingHistoryItemProps {
    record: ProfileClientHistoryModel;
}

interface InfoBlockProps {
    title: string;
    image: string | null;
    label: string;
    href?: string;
}

const InfoBlock: FC<InfoBlockProps> = ({ title, image, label, href }) => {
    const content = <>
        <img
            src={image
                ? BASE_STATIC_URL.concat(image)
                : DEFAULT_PROFILE_IMAGE}
            alt="Главное изображение"
            className={classNames(
                styles.avatar,
                "h-2rem",
                "w-2rem",
                "shadow-2",
                "mr-2"
            )}
        />
        <h3>{label}</h3>
    </>;

    return (
        <div className={classNames("col-12", "lg:col-6", "xl:col-6")}>
            <h3>{title}</h3>
            {href ? <Link className={classNames(styles.infoLink, "flex", "align-items-center", "mt-2")} href={href}>
                {content}
            </Link> : <div className={classNames("flex", "align-items-center", "mt-2")}>
                {content}
            </div>}
        </div>
    );
};

const BookingHistoryItem: FC<BookingHistoryItemProps> = ({ record }) => {
    const [date, time] = record.date.split(":");
    const dateInfo = moment(date, "YYYY-MM-DD", true);
    const formattedDate = dateInfo.format("DD/MM/YYYY");

    return <Panel
        header={`${record.procedureName}, ${formattedDate} (${Object.values(DAYS_OF_WEEK)[dateInfo.day() ? dateInfo.day() - 1 : 6]}), ${time.replace('-', ':')}`}
    >
        <div className="grid">
            <InfoBlock
                title="Салон:"
                image={record.saloonImage}
                label={record.saloonName}
                href={`${BASE_URL_FRONT}/saloons/${record.saloonId}`}
            />
            <InfoBlock title="Мастер:" image={record.masterImage} label={record.masterName} />
            <Divider />
            <h3 className="col-12">Статус: {record.statusName}</h3>
        </div>
    </Panel>
};

export default BookingHistoryItem;

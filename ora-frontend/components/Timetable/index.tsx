import { FC, Fragment, useMemo, useState } from "react";
import cn from "classnames";
import { Divider } from "primereact/divider";
import { Tooltip } from "primereact/tooltip";

import { BASE_URL_BACK } from "@/api";
import { prepareTime } from "@/utils";
import { DEFAULT_PROFILE_IMAGE } from "@/consts/profile";

import styles from "./style.module.scss";

export interface TimetableProps {
  timetable: TimetableMasterModel[];
  title?: string;
  classNames?: {
    container?: string;
    content?: string;
    title?: string;
    grid?: string;
  };
  showFromHour?: number;
  showToHour?: number;
}

export interface TimetableMasterModel {
  id: number;
  name: string;
  mainImage: string | null;
  serviceInstances: TimetableServiceInstanceModel[];
}

export interface TimetableServiceInstanceModel {
  id: number;
  procedureName: string;
  start: string;
  finish: string;
}

const Timetable: FC<TimetableProps> = ({ classNames, title, timetable, showFromHour = 0, showToHour = 23 }) => {
  const [markedMasterId, setMarkedMasterId] = useState<number | null>(null);

  const baseCellWidth = +styles['cell-width'];
  const hoursInDayArray = useMemo(() => [...Array(24)].slice(showFromHour, showToHour), []);

  return (
    <div className={cn("flex", "flex-column", classNames?.container)} >
      {title
        ? <div className={cn("flex", "align-items-center", "justify-content-center", classNames?.title)} >
          <h3>{title}</h3>
        </div>
        : null
      }

      <div className={cn("flex", styles.content, classNames?.content)} >
        <div className={cn("flex", "flex-column", classNames?.content)} >
          <div className="h-2rem" />
          {timetable.map(({ id, name, mainImage }) => (
            <div
              key={`master-${id}`}
              className={cn("h-4rem", "flex", "align-items-center", "gap-2", "p-2", styles.master, { [styles.marked]: id === markedMasterId })}
            >
              <img
                src={mainImage
                  ? BASE_URL_BACK.concat(mainImage)
                  : DEFAULT_PROFILE_IMAGE}
                alt={name}
                className={cn(styles.masterAvatar, "h-3rem", "w-3rem", "shadow-2")}
              />
              <p>{name}</p>
            </div>
          ))}
        </div>
        <Divider layout="vertical" />
        <div className={cn("flex", "flex-column", "flex-1", styles.grid, classNames?.grid)} >
          <div className={cn("h-2rem", "flex", "align-items-center")}>
            {hoursInDayArray.map((_, i) => (
              <div className={cn("h-2rem", "flex", "align-items-center", "justify-content-center", styles.timeLineCell)} key={`hour-${i}`}>
                <span>{i + showFromHour}</span>
              </div>
            ))}
          </div>
          {timetable.map(({ id: masterId, serviceInstances }) => (
            <div key={`timetable-master-${masterId}`} style={{ position: "relative" }} className={cn("h-4rem", "flex", "align-items-center")}>
              {hoursInDayArray.map((_, i) => (
                <div className={cn("h-4rem", "flex", styles.cell)} key={`timetable-master-${masterId}-cell-${i}`} />
              ))}
              {serviceInstances.map(({ id: serviceInstanceId, start, finish, procedureName }) => {
                const startDate = new Date(start);
                const finishDate = new Date(finish);

                const [startHour, startMinute] = [startDate.getHours(), startDate.getMinutes()];
                const [finishHour, finishMinute] = [finishDate.getHours(), finishDate.getMinutes()];

                const leftFromZero = (+startHour + (+startMinute / 60)) * baseCellWidth;
                const width = (+finishHour + (+finishMinute / 60)) * baseCellWidth - leftFromZero;
                const left = leftFromZero - showFromHour * baseCellWidth;

                const code = `service-master-${masterId}-instance-${serviceInstanceId}`;

                return (
                  <Fragment key={code}>
                    <div
                      style={{ left, width }}
                      className={cn("h-2rem", "mt-1", code, styles.serviceInstance)}
                      onMouseEnter={() => setMarkedMasterId(masterId)}
                      onMouseLeave={() => setMarkedMasterId(null)}
                    />
                    <Tooltip position="top" target={`.${code}`}>
                      <div>
                        <h3>{procedureName}</h3>
                        <Divider className="my-1" />
                        <p>Начало - {prepareTime(startHour, startMinute)}</p>
                        <p>Завершение - {prepareTime(finishHour, finishMinute)}</p>
                      </div>
                    </Tooltip>
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;

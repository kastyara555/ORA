import { FC } from "react";
import classNames from "classnames";

import WorkTableModel, {
  WorkDayModel,
  WorkTableDays,
} from "@/models/WorkTableModel";
import { DAY_NAMES_MAPPING } from "@/consts/saloon";
import { prepareTime } from "@/utils";

interface SaloonWorkingTimeProps {
  timeTable: WorkTableModel;
}

const SaloonWorkingTime: FC<SaloonWorkingTimeProps> = ({ timeTable }) => (
  <div className="mt-2">
    {Object.entries(timeTable).map(
      ([dayName, dayInfo]: [string, WorkDayModel]) => (
        <div
          key={dayName}
          className={classNames("flex", "justify-content-between")}
        >
          <h3 className="mt-1">
            {DAY_NAMES_MAPPING[dayName as WorkTableDays]}:&nbsp;
          </h3>
          <h3>
            {dayInfo.isWorking ? (
              <>
                {prepareTime(dayInfo.startHour ?? 0, dayInfo.startMinute ?? 0)}
                &nbsp;—&nbsp;
                {prepareTime(
                  dayInfo.finishHour ?? 0,
                  dayInfo.finishMinute ?? 0
                )}
              </>
            ) : (
              "Выходной"
            )}
          </h3>
        </div>
      )
    )}
  </div>
);

export default SaloonWorkingTime;

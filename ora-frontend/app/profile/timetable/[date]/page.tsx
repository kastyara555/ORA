"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import moment from "moment";

import ContentWrapper from "@/components/ContentWrapper";
import EditMasterTimetableDetails from "@/screens/Profile/EditProfile/EditMasterTimetableScreen/EditMasterTimetableDetails";

const TeamPage = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const dateFromPath = pathParts[pathParts.length - 1];
  const date = moment(dateFromPath, "DD-MM-YYYY", true);

  return (
    <ContentWrapper
      backHref="/profile/timetable"
      title="Редактирование времени записи"
    >
      <EditMasterTimetableDetails date={date} />
    </ContentWrapper>
  );
};

export default memo(TeamPage);

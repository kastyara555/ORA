import { memo } from "react";

import ContentWrapper from "@/components/ContentWrapper";
import EditMasterTimetableScreen from "@/screens/Profile/EditProfile/EditMasterTimetableScreen";

const TeamPage = () => (
  <ContentWrapper backHref="/profile" title="Выбор даты записи">
    <EditMasterTimetableScreen />
  </ContentWrapper>
);

export default memo(TeamPage);

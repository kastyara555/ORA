import { memo } from "react";

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import EditMasterTimetableScreen from "@/screens/Profile/EditProfile/EditMasterTimetableScreen";

const TeamPage = () => (
  <ProfileWrapper backHref="/profile" title="Выбор даты записи">
    <EditMasterTimetableScreen />
  </ProfileWrapper>
);

export default memo(TeamPage);

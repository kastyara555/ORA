import { memo } from "react";

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import EditTeamProfileScreen from "@/screens/Profile/EditProfile/EditTeamProfileScreen";

const TeamPage = () => (
  <ProfileWrapper backHref="/profile" title="Редактирование команды">
    <EditTeamProfileScreen />
  </ProfileWrapper>
);

export default memo(TeamPage);

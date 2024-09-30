import { memo } from "react";

import ContentWrapper from "@/components/ContentWrapper";
import EditTeamProfileScreen from "@/screens/Profile/EditProfile/EditTeamProfileScreen";

const TeamPage = () => (
  <ContentWrapper backHref="/profile" title="Редактирование команды">
    <EditTeamProfileScreen />
  </ContentWrapper>
);

export default memo(TeamPage);

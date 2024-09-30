import { memo } from "react";

import ContentWrapper from "@/components/ContentWrapper";
import ProfileTimeTableSelectDateScreen from "@/screens/Profile/ProfileTimeTableSelectDateScreen";

const TeamPage = () => (
  <ContentWrapper backHref="/profile" title="Выбор даты записи">
    <ProfileTimeTableSelectDateScreen />
  </ContentWrapper>
);

export default memo(TeamPage);

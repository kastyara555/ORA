import { memo } from "react";

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import EditServicesScreen from "@/screens/Profile/EditProfile/EditServicesScreen";

const ServicesPage = () => (
  <ProfileWrapper backHref="/profile" title="Редактирование услуг">
    <EditServicesScreen />
  </ProfileWrapper>
);

export default memo(ServicesPage);

import { memo } from "react";

import ContentWrapper from "@/components/ContentWrapper";
import EditServicesScreen from "@/screens/Profile/EditProfile/EditServicesScreen";

const ServicesPage = () => (
  <ContentWrapper backHref="/profile" title="Редактирование услуг">
    <EditServicesScreen />
  </ContentWrapper>
);

export default memo(ServicesPage);

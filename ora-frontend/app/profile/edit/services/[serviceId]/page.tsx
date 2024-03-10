import { memo } from "react";

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import EditServiceScreen from "@/screens/Profile/EditProfile/EditServiceScreen";

const ServicePage = ({ params }: { params: { serviceId: string } }) => (
  <ProfileWrapper backHref="/profile/edit/services" title="Редактирование услуги">
    <EditServiceScreen serviceId={params.serviceId} />
  </ProfileWrapper>
);

export default memo(ServicePage);

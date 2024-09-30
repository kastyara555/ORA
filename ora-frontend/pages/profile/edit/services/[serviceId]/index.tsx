import { memo } from "react";

import ContentWrapper from "@/components/ContentWrapper";
import EditServiceScreen from "@/screens/Profile/EditProfile/EditServiceScreen";

const ServicePage = ({ params }: { params: { serviceId: string } }) => (
  <ContentWrapper backHref="/profile/edit/services" title="Редактирование услуги">
    <EditServiceScreen serviceId={params.serviceId} />
  </ContentWrapper>
);

export default memo(ServicePage);

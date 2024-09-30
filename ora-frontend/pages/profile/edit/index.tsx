import EditProfile from "@/components/EditProfile";
import ContentWrapper from "@/components/ContentWrapper";

const ProfileEditPage = () => (
  <ContentWrapper backHref="/profile" title="Настройки учетной записи">
    <EditProfile />
  </ContentWrapper>
);

export default ProfileEditPage;

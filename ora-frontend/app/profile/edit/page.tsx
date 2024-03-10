import EditProfile from "@/components/EditProfile";
import ProfileWrapper from "@/components/Profile/ProfileWrapper";

const ProfileEditPage = () => (
  <ProfileWrapper backHref="/profile" title="Настройки учетной записи">
    <EditProfile />
  </ProfileWrapper>
);

export default ProfileEditPage;

import ProfileWrapper from "@/components/Profile/ProfileWrapper";
import EditTeamAddMasterScreen from "@/screens/Profile/EditProfile/EditTeamAddMasterScreen";

const AddMasterPage = () => (
  <ProfileWrapper
    backHref="/profile/edit/team"
    title="Страница добавления мастера"
  >
    <EditTeamAddMasterScreen />
  </ProfileWrapper>
);

export default AddMasterPage;

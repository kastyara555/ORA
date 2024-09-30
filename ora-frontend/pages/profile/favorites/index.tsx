import ContentWrapper from "@/components/ContentWrapper";
import FavoritesScreen from "@/screens/Profile/Favorites";

const ProfileFavoritesPage = () => (
  <ContentWrapper backHref="/profile" title="Избранное">
    <FavoritesScreen />
  </ContentWrapper>
);

export default ProfileFavoritesPage;

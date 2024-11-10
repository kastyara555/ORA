import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import FavoritesScreen from "@/screens/Profile/Favorites";

const ProfileFavoritesPage = () => (
  <>
    <Head>
      <title>ORA - Избранное</title>
    </Head>
    <ContentWrapper backHref="/profile" title="Избранное">
      <FavoritesScreen />
    </ContentWrapper>
  </>
);

export default ProfileFavoritesPage;

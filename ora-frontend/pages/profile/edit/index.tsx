import Head from "next/head";

import EditProfile from "@/components/EditProfile";
import ContentWrapper from "@/components/ContentWrapper";

const ProfileEditPage = () => (
  <>
    <Head>
      <title>ORA - Настройки учетной записи</title>
    </Head>
    <ContentWrapper backHref="/profile" title="Настройки учетной записи">
      <EditProfile />
    </ContentWrapper>
  </>
);

export default ProfileEditPage;

import { memo } from "react";
import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import EditTeamProfileScreen from "@/screens/Profile/EditProfile/EditTeamProfileScreen";

const TeamPage = () => (
  <>
    <Head>
      <title>ORA - Редактирование команды</title>
    </Head>
    <ContentWrapper backHref="/profile" title="Редактирование команды">
      <EditTeamProfileScreen />
    </ContentWrapper>
  </>
);

export default memo(TeamPage);

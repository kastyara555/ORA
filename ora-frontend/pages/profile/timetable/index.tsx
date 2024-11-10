import { memo } from "react";
import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import ProfileTimeTableSelectDateScreen from "@/screens/Profile/ProfileTimeTableSelectDateScreen";

const CalendarPage = () => (
  <>
    <Head>
      <title>ORA - Выбор даты записи</title>
    </Head>
    <ContentWrapper backHref="/profile" title="Выбор даты записи">
      <ProfileTimeTableSelectDateScreen />
    </ContentWrapper>
  </>
);

export default memo(CalendarPage);

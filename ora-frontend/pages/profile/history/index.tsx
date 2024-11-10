import Head from "next/head";

import ContentWrapper from "@/components/ContentWrapper";
import BookingHistoryScreen from "@/screens/BookingHistory";

const ProfileHistoryPage = () => (
  <>
    <Head>
      <title>ORA - История бронирования</title>
    </Head>
    <ContentWrapper backHref="/profile" title="История бронирования">
      <BookingHistoryScreen />
    </ContentWrapper>
  </>
);

export default ProfileHistoryPage;

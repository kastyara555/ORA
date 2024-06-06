import ContentWrapper from "@/components/ContentWrapper";
import BookingHistoryScreen from "@/screens/BookingHistory";

const ProfileHistoryPage = () => (
  <ContentWrapper backHref="/profile" title="История бронирования">
    <BookingHistoryScreen />
  </ContentWrapper>
);

export default ProfileHistoryPage;

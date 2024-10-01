import { GetServerSidePropsContext } from "next";
import { FC, memo } from "react";
import moment from "moment";

import ContentWrapper from "@/components/ContentWrapper";
import ProfileTimeTableScreen from "@/screens/Profile/ProfileTimeTableScreen";

interface TimetablePageProps {
  date: string;
}

const TimetablePage: FC<TimetablePageProps> = ({ date }) => {
  const formattedDate = moment(date, "DD-MM-YYYY", true);

  return (
    <ContentWrapper
      backHref="/profile/timetable"
      title="Расписание"
    >
      <ProfileTimeTableScreen date={formattedDate} />
    </ContentWrapper>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { date } = ctx.query as { date: string };

  return {
    props: {
      date,
    },
  }
};

export default memo(TimetablePage);

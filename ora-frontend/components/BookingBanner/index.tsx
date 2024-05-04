import { getCitiesUrl } from "@/api/categories";
import BookingBannerForm from "@/components/BookingBanner/BookingBannerForm";

import styles from "./style.module.scss";

const BookingBanner = async () => {
  const citiesRes = await fetch(getCitiesUrl, { next: { revalidate: 600 } });
  const cities = (await citiesRes.json()).map(({ id, name }: any) => ({
    label: name,
    value: id,
  }));

  return (
    <div className={styles.banner}>
      <div className={styles.form}>
        <h3>Находи и бронируй запись у профессионалов бьюти индустрии</h3>
        <BookingBannerForm cities={cities} />
      </div>
    </div>
  );
};

export default BookingBanner;

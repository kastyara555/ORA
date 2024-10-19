import BookingBannerForm from "@/components/BookingBanner/BookingBannerForm";

import styles from "./style.module.scss";

// TODO: Когда будет много салонов в городах, разблокировать выбор города для процедуры
const BookingBanner = () => {
  // const citiesRes = await fetch(getCitiesUrl, { next: { revalidate: 600 } });
  // const cities = (await citiesRes.json()).map(({ id, name }: any) => ({
  //   label: name,
  //   value: id,
  // }));

  return (
    <div className={styles.banner}>
      <div className={styles.form}>
        <h2>Находи и бронируй запись у профессионалов бьюти индустрии</h2>
        <BookingBannerForm />
      </div>
    </div>
  );
};

export default BookingBanner;

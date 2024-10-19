import { FC } from "react";
import { MenuItem } from "primereact/menuitem";

import { HOME_CONTENT_IMAGE_1, HOME_CONTENT_IMAGE_2, HOME_CONTENT_IMAGE_3 } from "@/consts/home";
import Advantages from "@/components/Advantages";
// import Recomended from "@/components/Recomended";
import BookingBanner from "@/components/BookingBanner";
import CategoriesMenu from "@/components/CategoriesMenu";

import InfoBlock from "./InfoBlock";
import styles from "./style.module.scss";

interface HomeScreenProps {
  categoriesTree: MenuItem[];
}

const HomeScreen: FC<HomeScreenProps> = ({ categoriesTree }) => (
  <div className={styles.main}>
    <CategoriesMenu categoriesTree={categoriesTree} />
    <BookingBanner />
    <Advantages />
    {/* TODO: обдумать блок рекомендаций */}
    {/* <Recomended /> */}
    <InfoBlock
      className="mt-8"
      title="Планируй свою жизнь лучше"
      imageSrc={HOME_CONTENT_IMAGE_1}
      content={
        <>Ищешь для себя процедуру у местного мастера по ногтям, бровиста или барбера? Тебе нужно записаться на укладку волос или на прием к косметологу?<br /><br />ORA - это бесплатное приложение по поиску и бронированию лучших услуг в твоем городе. Больше никаких телефонных заметок, звонков мастерам для уточнения свободных мест. Бронируй в любое время и в любом месте 24/7.<br /><br />Сделай свою жизнь еще комфортнее и лучше с ORA.</>
      }
    />
    <InfoBlock
      className="mt-6"
      title="Огромный выбор услуг и мастеров"
      imageSrc={HOME_CONTENT_IMAGE_2}
      content="Вас ждет широчайший выбор услуг и опытных мастеров, готовых подарить вам моменты истинного блаженства и красоты. От парикмахерских услуг до массажа и косметологии — у нас вы найдете все, что нужно для идеального образа и полного расслабления."
      order="reverse"
    />
    <InfoBlock
      className="mt-6"
      title="Уникальная система лояльности"
      imageSrc={HOME_CONTENT_IMAGE_3}
      content={<>А это еще не все! Радуйтесь эксклюзивным бонусам, скидкам и программе лояльности, которые подарят вам дополнительные приятные моменты и превратят ваш опыт в незабываемое путешествие по миру красоты!<br /><br />Присоединяйтесь к нам и познайте простоту и радость онлайн-записи, делая вашу жизнь ярче и краше с каждым кликом!</>}
    />
  </div>
);

export default HomeScreen;

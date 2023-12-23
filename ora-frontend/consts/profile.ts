import { BASE_ASSETS_URL } from "@/api";
import { ProfileLinkModel } from "@/components/Profile/ProfileLink";

export const USER_TYPES = {
  client: "Клиент",
  saloon: "Салон",
};

export const DEFAULT_PROFILE_IMAGE = BASE_ASSETS_URL.concat(
  "/images/profile/defaultProfileImage.png"
);

export const BONUS_PROFILE_IMAGE = BASE_ASSETS_URL.concat(
  "/images/profile/bonusLogo.png"
);

export const PROFILE_CLIENT_LINKS: ProfileLinkModel[] = [
  {
    href: "/profile/history",
    title: "История бронирования",
    description:
      "Просматривайте и управляйте своими прошлыми и предстоящими бронированиями",
  },
  {
    href: "/profile/edit",
    title: "Настройки учетной запис",
    description: "Редактируйте ваш профиль и контактную информаци",
  },
  {
    href: "/",
    title: "Пригласи друга и получи 5 рублей",
    description:
      "Вы и приглашенные вами друзья получите скидку 5 рублей на ваши онлайн-бронирования и услуги",
  },
];

export const PROFILE_SALOON_LINKS: ProfileLinkModel[] = [
  {
    href: "/",
    title: "Команда",
    description: "Просматривайте и управляйте своей командой ",
  },
  {
    href: "/",
    title: "Редактирование услуг",
    description: "Добавление, редактирование, удаление типов услуг",
  },
  {
    href: "/profile/history",
    title: "История бронирования",
    description: "Просматривайте историю бронирования вашего салона",
  },
  {
    href: "/profile/edit",
    title: "Настройки учетной записи салона",
    description: "Редактируйте профиль салона и контактную информацию",
  },
  {
    href: "/",
    title: "Отзывы",
    description: "Просматривайте актуальные отзывы вашего салона",
  },
];

import { BASE_ASSETS_URL } from "@/api";
import { ProfileLinkModel } from "@/components/Profile/ProfileLink";

export const USER_TYPES = {
  client: "Клиент",
  master: "Мастер",
  saloon: "Салон",
} as const;

type userTypesKeys = keyof typeof USER_TYPES;
export type userTypesType = (typeof USER_TYPES)[userTypesKeys];

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
    disabled: true,
  },
  {
    href: "/profile/edit",
    title: "Настройки учетной записи",
    description: "Редактируйте ваш профиль и контактную информаци",
  },
  {
    href: "/",
    title: "Пригласи друга и получи 5 рублей",
    description:
      "Вы и приглашенные вами друзья получите скидку 5 рублей на ваши онлайн-бронирования и услуги",
    disabled: true,
  },
];

export const PROFILE_MASTER_LINKS: ProfileLinkModel[] = [
  {
    href: "/profile",
    title: "Расписание",
    description:
      "Создавайте и корректируйте доступное время для оказания услуг",
    disabled: true,
  },
  {
    href: "/profile/history",
    title: "История бронирования",
    description:
      "Просматривайте и управляйте своими прошлыми и предстоящими бронированиями",
    disabled: true,
  },
  {
    href: "/profile/edit",
    title: "Настройки учетной записи",
    description: "Редактируйте ваш профиль и контактную информаци",
  },
];

export const PROFILE_SALOON_LINKS: ProfileLinkModel[] = [
  {
    href: "/profile/edit/team",
    title: "Команда",
    description: "Просматривайте и управляйте своей командой ",
  },
  {
    href: "/profile/edit/services",
    title: "Редактирование услуг",
    description: "Добавление, редактирование, удаление типов услуг",
  },
  {
    href: "/profile/history",
    title: "История бронирования",
    description: "Просматривайте историю бронирования вашего салона",
    disabled: true,
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
    disabled: true,
  },
];

interface routeConfiguration {
  url: string;
  availableUserTypes?: userTypesType[];
  noStrict?: boolean;
}

export const PRIVATE_ROUTES: routeConfiguration[] = [
  {
    url: "/profile",
  },
  {
    url: "/profile/edit",
  },
  {
    url: "/profile/edit/team",
    availableUserTypes: [USER_TYPES.saloon],
    noStrict: true,
  },
  {
    url: "/profile/edit/services",
    availableUserTypes: [USER_TYPES.saloon],
    noStrict: true,
  },
  {
    url: "/profile/history",
  },
];

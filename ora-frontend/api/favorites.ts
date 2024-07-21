import { BASE_API_URL } from "@/api/index";

export const clientFavoriteSaloonsUrl = BASE_API_URL.concat('/favorites/checkSaloons');

export const clientSaveFavoriteUrl = BASE_API_URL.concat('/favorites/save');

export const clientGetFavoriteUrl = BASE_API_URL.concat('/favorites/get');

export const clientClearFavoriteUrl = BASE_API_URL.concat('/favorites/clear');

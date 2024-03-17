import { BASE_API_URL } from "@/api/index";

export const postSendPasswordRestorationUrl =
  BASE_API_URL.concat("/password/send");

export const postUpdatePasswordUrl = BASE_API_URL.concat("/password/update");

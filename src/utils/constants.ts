import { HOST_API } from "@env";

export const API_BASE_URL = __DEV__
  ? HOST_API
  : "https://api-inquadra-uat.qodeless.com.br";

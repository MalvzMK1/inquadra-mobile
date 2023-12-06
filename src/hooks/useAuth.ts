import { useQuery } from "@apollo/client";
import { UserGeolocation } from "../types/UserGeolocation";
import { MeQueryResponse, meQuery } from "../types/me";

type UseAuthData = {
  isAdmin: boolean;
} & (
  | {
      user: null;
      isAuthenticated: false;
    }
  | {
      user: User;
      info: UserInfos;
      geolocation: UserGeolocation;
      isAuthenticated: true;
    }
);


export function useAuth(): UseAuthData {
  const { data } = useQuery<MeQueryResponse>(meQuery, { ssr: false });

  if (!data) {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  return {
    user: data.me,
    isAuthenticated: true,
    isAdmin: false,
    geolocation: {
        latitude: 1,
        longitude: 2
    },
    info: {
        token: "123",
        userId: data.me.id
    }
  };
}

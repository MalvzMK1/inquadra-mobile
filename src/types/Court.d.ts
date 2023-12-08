type CourtCardInfos = {
  id: string;
  image: string;
  name: string;
  type: string | string[];
  distance: number;
  liked: boolean;
  updated?: any
  setUserFavoriteCourts?: any
  userFavoriteCourts?: any
};

type Court = {
  id: string;
  name: string;
  fantasy_name: string;
  address: string;
  image: string;
};

type CourtAdd = {
  court_name: string;
  courtType: string[];
  fantasyName: string;
  photos: string[];
  court_availabilities: string[];
  minimum_value: number;
  currentDate: string;
};

type CourtAddRawPayload = {
  court_name: string;
  courtType: string[];
  fantasyName: string;
  photos: { uri: string }[];
  court_availabilities: TAppointment[][];
  minimum_value: number;
  currentDate: string;
  dayUse: boolean[];
};

type TAppointment = {
  startsAt: string;
  endsAt: string;
  price: string;
}

type CourtAvailability = {
  id: string;
  status: boolean;
  dayUseService?: boolean;
  startsAt: string;
  endsAt: string;
  weekDay: WeekDays;
  value: number;
  minValue: number;
  title?: string;
};

type GraphQLCourtAvailability = {
  id: string;
  __typename?: string;
  attributes: Omit<CourtAvailability, "id">;
};

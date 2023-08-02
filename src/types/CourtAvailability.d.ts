type CourtAvailability = {
    id: string
    status: Boolean
    dayUseService?: Boolean
    startsAt: DateTime
    endsAt: DateTime
    weekDay: WeekDays
    value: number
    title?: string
}

type GraphQLCourtAvailability = {
    id: string,
    __typename?: string,
    attributes: Omit<CourtAvailability, 'id'>
}

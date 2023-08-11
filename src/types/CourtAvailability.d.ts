type CourtAvailability = {
    id: string
    status: Boolean
    dayUseService?: Boolean
    startsAt: string
    endsAt: string
    weekDay: WeekDays
    value: number
    minValue:number
    title?: string
}

type GraphQLCourtAvailability = {
    id: string,
    __typename?: string,
    attributes: Omit<CourtAvailability, 'id'>
}

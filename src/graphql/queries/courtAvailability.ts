import { gql } from "@apollo/client";

export interface ICourtAvailabilityResponse {
    court: {
        data: {
            id: Court['id']
            attributes: {
                name:Court['name']
                establishment: {
                    data: {
                        id: Establishment['id']
                    }
                }
                court_availabilities: {
                    data: Array<{
                        id: CourtAvailability['id']
                        attributes: {
                            startsAt: CourtAvailability['startsAt']
                            endsAt: CourtAvailability['endsAt']
                            status: CourtAvailability['status']
                            value: CourtAvailability['value']
                            weekDay: WeekDays
                        }
                    }>
                }
            }
        }
    }
}

export interface ICourtAvailabilityVariable {
    id: string
}

export const courtAvailabilityQuery = gql`
    query reserveDisponible($id: ID!) {
        court(id: $id) {
            data {
                id
                attributes {
                    name
                    establishment {
                        data {
                            id
                        }
                    }
                    court_availabilities {
                        data {
                            id
                            attributes {
                                startsAt
                                endsAt
                                status
                                value
                                weekDay
                            }
                        }
                    }
                }
            }
        }
    }
`;
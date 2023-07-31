import { gql } from "@apollo/client";

export interface ICourtAvailabilityResponse {
    courts: {
        data: Array<{
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
                        }
                    }>
                }
            }
        }>
    }
}

export interface ICourtAvailabilityVariable {
    id: string
}

export const courtAvailabilityQuery = gql`
    query reserveDisponible($id: ID!) {
        courts(filters: { id: { eq: $id } }) {
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
                            }
                        }
                    }
                }
            }
        }
    }
`;
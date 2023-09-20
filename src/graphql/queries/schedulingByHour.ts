import { gql } from "@apollo/client";

export interface ICourtAvailabilityByHourResponse {
    courtAvailabilities: {
        data?: Array<{
            id: CourtAvailability['id']
        }>
    }
}

export interface ICourtAvailabilityByHourVariables {
    hour: {
        eq: string
    }
    court_id: {
        eq: string
    }
}

export const courtAvailabilityByHourQuery = gql`
    query getAvailabilitiesByHour($hour: TimeFilterInput, $court_id: IDFilterInput) {
        courtAvailabilities(
            filters: {
                startsAt: $hour,
                court: {
                    id: $court_id
                }
            }
        ) {
            data {
                id
            }
        }
    }
`
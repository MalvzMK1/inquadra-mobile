import { gql } from "@apollo/client";

export interface IBlockScheduleByHourResponse {
    updateCourtAvailability: {
        data: {
            id: CourtAvailability['id']
        }
    }
}

export interface IBlockScheduleByHourVariables {
    court_availability_id: string
}

export const blockScheduleByHourMutation = gql`
    mutation blockScheduleByHour($court_availability_id: ID!) {
        updateCourtAvailability(
            id: $court_availability_id, 
            data: { 
                status: false
            }
        ) {
            data {
                id
            }
        }
    }
`
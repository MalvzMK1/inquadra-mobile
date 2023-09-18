import { gql } from "@apollo/client";

export interface IBlockScheduleResponse {
    updateScheduling: {
        data: {
            id: Schedule['id']
        }
    }
}

export interface IBlockScheduleVariable {
    scheduling_id: string
}

export const blockScheduleMutation = gql`
    mutation blockSchedule($scheduling_id: ID!) {
        updateScheduling(
            id: $scheduling_id
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
import { useMutation, MutationTuple } from "@apollo/client"
import { IBlockScheduleByHourResponse, IBlockScheduleByHourVariables, blockScheduleByHourMutation } from "../graphql/mutations/blockScheduleByHour"

export default function useBlockScheduleByHour(): MutationTuple<IBlockScheduleByHourResponse, IBlockScheduleByHourVariables> {
    return useMutation<IBlockScheduleByHourResponse, IBlockScheduleByHourVariables>(blockScheduleByHourMutation)
}
import { useMutation, MutationTuple } from "@apollo/client";
import { IBlockScheduleResponse, IBlockScheduleVariable, blockScheduleMutation } from "../graphql/mutations/blockSchedule";

export default function useBlockSchedule(): MutationTuple<IBlockScheduleResponse, IBlockScheduleVariable> {
    return useMutation<IBlockScheduleResponse, IBlockScheduleVariable>(blockScheduleMutation)
}
import { useMutation } from "@apollo/client";
import {
    IRegisterSchedulingResponse,
    IRegisterSchedulingVariables,
    registerSchedulingMutation
} from "../graphql/mutations/registerScheduling"

export default function useRegisterSchedule(){
    return useMutation<IRegisterSchedulingResponse, IRegisterSchedulingVariables>(registerSchedulingMutation)
}


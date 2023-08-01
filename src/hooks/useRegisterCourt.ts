import { useMutation } from "@apollo/client";
import{
    IRegisterCourtResponse,
    IRegisterCourtVariables,
    registerCourtMutation
} from "../graphql/mutations/registerCourt"

export default function useRegisterCourt(){
    return useMutation<IRegisterCourtResponse, IRegisterCourtVariables>(registerCourtMutation)
}
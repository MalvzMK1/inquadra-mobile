import {useMutation} from "@apollo/client";
import {
    IUserPaymentPixResponse,
    IUserPaymentPixVariables,
    userPaymentPixMutation,

} from "../graphql/mutations/userPaymentPix"

export function useUserPaymentPix(){
    return useMutation<IUserPaymentPixResponse, IUserPaymentPixVariables>(userPaymentPixMutation)
}
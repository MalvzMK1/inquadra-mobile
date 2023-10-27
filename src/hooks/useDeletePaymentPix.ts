import { useMutation } from "@apollo/client";
import {
    IDeletePaymentPixVariables,
    IDeleteUserPaymentPixResponse,
    deletePaymentPix
} from "../graphql/mutations/deleteUserPaymentPix"

export default function useDeletePaymentPix(){
    return useMutation<IDeleteUserPaymentPixResponse, IDeletePaymentPixVariables>(deletePaymentPix)
}
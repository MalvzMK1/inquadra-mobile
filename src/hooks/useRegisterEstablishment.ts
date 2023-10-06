import { useMutation } from "@apollo/client";
import {
  IRegisterEstablishmentResponse,
  IRegisterEstablishmentVariables,
  registerEstablishmentMutation,
} from "../graphql/mutations/registerEstablishment";

export default function useRegisterEstablishment() {
  return useMutation<
    IRegisterEstablishmentResponse,
    IRegisterEstablishmentVariables
  >(registerEstablishmentMutation);
}

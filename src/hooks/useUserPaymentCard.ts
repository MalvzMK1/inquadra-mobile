import { useMutation } from "@apollo/client";
import {
  IUserPaymentCardResponse,
  IUserPaymentCardVariables,
  userPaymentCardMutation,
} from "../graphql/mutations/userPaymentCard";

export function useUserPaymentCard() {
  return useMutation<IUserPaymentCardResponse, IUserPaymentCardVariables>(
    userPaymentCardMutation,
  );
}

import { useMutation } from "@apollo/client";
import {
  IRegisterCourtAvailabilityResponse,
  IRegisterCourtAvailabilityVariables,
  registerCourtAvailabilityMutation,
} from "../graphql/mutations/registerCourtAvailability";

export default function useRegisterCourtAvailability() {
  return useMutation<
    IRegisterCourtAvailabilityResponse,
    IRegisterCourtAvailabilityVariables
  >(registerCourtAvailabilityMutation);
}

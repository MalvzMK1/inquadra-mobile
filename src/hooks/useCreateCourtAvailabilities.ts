import { useMutation } from "@apollo/client";
import {
  CreateCourtAvailabilitiesResponse,
  CreateCourtAvailabilitiesVariables,
  createCourtAvailabilitiesMutation,
} from "../graphql/mutations/createCourtAvailabilities";

export default function useCreateCourtAvailabilities() {
  return useMutation<
    CreateCourtAvailabilitiesResponse,
    CreateCourtAvailabilitiesVariables
  >(createCourtAvailabilitiesMutation);
}

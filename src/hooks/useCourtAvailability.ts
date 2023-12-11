import { QueryResult, useQuery } from "@apollo/client";
import {
  ICourtAvailabilityResponse,
  ICourtAvailabilityVariable,
  courtAvailabilityQuery,
} from "../graphql/queries/courtAvailability";

export default function useCourtAvailability(
  courtID: string,
): QueryResult<ICourtAvailabilityResponse, ICourtAvailabilityVariable> {
  return useQuery<ICourtAvailabilityResponse, ICourtAvailabilityVariable>(
    courtAvailabilityQuery,
    {
      variables: {
        id: courtID,
      },
    },
  );
}

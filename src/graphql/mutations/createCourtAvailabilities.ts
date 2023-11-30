import { gql } from "@apollo/client";

export interface CreateCourtAvailabilitiesResponse {
  createCourtAvailabilitiesCustom: {
    success: boolean;
    ids: string[];
  };
}

export interface CreateCourtAvailabilitiesVariables {
  data: Array<{
    week_day: string;
    value: number;
    starts_at: string;
    ends_at: string;
    day_use_service: boolean;
    court?: number | string;
    status: boolean;
    publishedAt: string;
  }>;
}

export const createCourtAvailabilitiesMutation = gql`
  mutation CreateCourtAvailabilitiesCustom(
    $data: [CreateCourtAvailabilitiesInputCustom!]!
  ) {
    createCourtAvailabilitiesCustom(data: $data) {
      success
      ids
    }
  }
`;

import { gql } from "@apollo/client";

export interface SchedulingsByRedeemCodeResponse {
  schedulings: {
    data: Array<{
      id: string;
    }>;
  };
}

export interface SchedulingsByRedeemCodeVariables {
  redeemCode: string;
}

export const schedulingsByRedeemCodeQuery = gql`
  query SchedulingsByRedeemCode($redeemCode: String!) {
    schedulings(filters: { redeemCode: { eq: $redeemCode } }) {
      data {
        id
      }
    }
  }
`;

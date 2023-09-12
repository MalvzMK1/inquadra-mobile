import { gql } from "@apollo/client";

export interface IGenerateActivationKeyResponse {
    updateScheduling: {
        data: {
            attributes: {
                activationKey: Scheduling['activation_key']
            }
        }
    }
}

export interface IGenerateActivationKeyVariables {
    scheduleID: string
    activationKey: string
}

export const generateActivationKeyMutation = gql`
mutation generateActivationKey($scheduleID: ID!, $activationKey: String) {
  updateScheduling(id: $scheduleID, data: { activationKey: $activationKey }) {
    data {
      attributes {
        activationKey
      }
    }
  }
}
`
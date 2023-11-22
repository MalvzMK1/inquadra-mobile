import { gql } from "@apollo/client";

export interface UserByCpfResponse {
  usersPermissionsUsers: {
    data: Array<{
      id: User["id"];
    }>;
  };
}

export interface UserByCpfVariables {
  cpf: string;
}

export const userByCpfQuery = gql`
  query UserByCpf($cpf: String!) {
    usersPermissionsUsers(filters: { cpf: { eq: $cpf } }) {
      data {
        id
      }
    }
  }
`;

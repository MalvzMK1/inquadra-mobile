import { QueryResult, useQuery } from "@apollo/client";
import {
  IUserByEmailResponse,
  IUserByEmailVariables,
  userByEmailQuery,
} from "../graphql/queries/userByEmail";

export function useUserByEmail(
  email: string,
): QueryResult<IUserByEmailResponse, IUserByEmailVariables> {
  return useQuery<IUserByEmailResponse, IUserByEmailVariables>(
    userByEmailQuery,
    {
      variables: {
        email,
      },
      skip: !email,
    },
  );
}

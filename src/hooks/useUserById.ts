import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  IUserByIdResponse,
  IUserByIdVariables,
  userByIdQuery,
} from "../graphql/queries/userById";

export function useGetUserById(
  id: string,
  options?: Omit<
    QueryHookOptions<IUserByIdResponse, IUserByIdVariables>,
    "variables"
  >,
) {
  return useQuery<IUserByIdResponse, IUserByIdVariables>(userByIdQuery, {
    ...options,
    variables: {
      id,
    },
  });
}

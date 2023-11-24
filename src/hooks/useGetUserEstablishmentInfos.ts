import { QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import {
  IUserEstablishmentResponse,
  IUserEstablishmentVariables,
  userEstablishmentQuery,
} from "../graphql/queries/userEstablishmentInfo";

export function useGetUserEstablishmentInfos(
  userId: string,
  options?: Omit<
    QueryHookOptions<IUserEstablishmentResponse, IUserEstablishmentVariables>,
    "variables"
  >,
): QueryResult<IUserEstablishmentResponse, IUserEstablishmentVariables> {
  return useQuery<IUserEstablishmentResponse, IUserEstablishmentVariables>(
    userEstablishmentQuery,
    {
      ...options,
      variables: {
        id: userId,
      },
    },
  );
}

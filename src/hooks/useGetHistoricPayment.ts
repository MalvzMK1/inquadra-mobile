import { QueryResult, useQuery } from "@apollo/client";
import {
    IHistoricPayment,
    VariableHistoricPayment,
    historicPaymentonQuery
} from "../graphql/queries/historicPayment";

export function useGetUserHistoricPayment(ID: string): QueryResult<IHistoricPayment, VariableHistoricPayment> {
	return useQuery<IHistoricPayment, VariableHistoricPayment>(historicPaymentonQuery, {
		variables: {
			ID
		}
	});
}
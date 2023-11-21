import { QueryResult, useQuery } from "@apollo/client";
import {
    IHistoricPaymentFiltred,
    VariableHistoricPaymentFiltred,
    historicPaymentFiltredQuery
} from "../graphql/queries/historicPaymentFiltred";

export function useGetUserHistoricPaymentFiltred(ID: string, date:string): QueryResult<IHistoricPaymentFiltred, VariableHistoricPaymentFiltred> {
	return useQuery<IHistoricPaymentFiltred, VariableHistoricPaymentFiltred>(historicPaymentFiltredQuery, {
		variables: {
			ID,
            date
		}
	});
}